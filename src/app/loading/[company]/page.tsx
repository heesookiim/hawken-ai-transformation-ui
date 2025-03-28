'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { apiService } from '@/lib/api';

// Maximum polling time: 15 minutes (900 seconds)
const MAX_POLLING_DURATION_MS = 3 * 60 * 1000;
// Polling interval: 5 seconds
const POLLING_INTERVAL_MS = 5000;

export default function AnalysisLoadingPage() {
  const router = useRouter();
  const params = useParams<{ company: string }>();
  const company = params?.company || 'company';
  const [progress, setProgress] = useState(10);
  const [status, setStatus] = useState('Starting analysis...');
  const [error, setError] = useState('');
  
  // Track polling start time and duration
  const pollingStartTimeRef = useRef<number>(Date.now());
  const [pollingDuration, setPollingDuration] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Calculate how long we've been polling
        const currentTime = Date.now();
        const elapsedTime = currentTime - pollingStartTimeRef.current;
        setPollingDuration(elapsedTime);
        
        // Check if we've exceeded the maximum polling time
        if (elapsedTime > MAX_POLLING_DURATION_MS) {
          setError('Analysis is taking longer than expected. Please try again later or contact support.');
          return; // Stop polling
        }
        
        // Check if the analysis is complete
        const cacheStatus = await apiService.checkCacheStatus(company as string);
        
        if (cacheStatus.exists && cacheStatus.files?.some(f => f.name === 'final_proposal.json')) {
          // Analysis is complete, redirect to dashboard
          router.push(`/dashboard/${company}`);
          return; // Stop polling
        } else if (cacheStatus.exists && cacheStatus.inProgress === false) {
          // The analysis process has stopped but no final result was produced
          setError('Analysis failed to complete. Please try again or contact support.');
          return; // Stop polling
        } else {
          // Update progress for visual feedback - cap at 95% until complete
          setProgress(prev => {
            // Calculate progress based on polling time relative to max time
            // But cap between 10-95% so it doesn't reach 100% until complete
            const timeProgress = Math.min(95, Math.max(10, Math.floor((elapsedTime / MAX_POLLING_DURATION_MS) * 100)));
            return timeProgress;
          });
          
          // Update status message
          if (cacheStatus.exists && cacheStatus.inProgress) {
            setStatus('Analysis in progress. This may take several minutes to complete.');
          } else {
            setStatus('Initializing analysis. Please wait while we prepare your data.');
          }
          
          // Check again after the polling interval
          timeoutRef.current = setTimeout(checkStatus, POLLING_INTERVAL_MS);
        }
      } catch (error) {
        console.error('Error checking analysis status:', error);
        setError('Failed to check analysis status. Please try again.');
      }
    };

    // Start the status checking process
    checkStatus();
    
    // Cleanup function to clear the timeout when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [company, router]);

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Analyzing {company}</h1>
      
      <div className="w-full max-w-md mb-8">
        <Progress 
          value={progress} 
          className="h-3 mb-2 border border-border rounded-full" 
        />
        <p className="text-center text-muted-foreground">{status}</p>
        
        {/* Add elapsed time indicator */}
        <p className="mt-2 text-sm text-center text-muted-foreground">
          Time elapsed: {Math.floor(pollingDuration / 1000 / 60)}m {Math.floor((pollingDuration / 1000) % 60)}s
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-500 border border-red-300 rounded-md bg-red-50">
          {error}
        </div>
      )}
    </div>
  );
} 