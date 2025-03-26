import axios from 'axios';
import { getApiBaseUrl } from '@/lib/api';

// Make sure all API calls use the getApiBaseUrl function which now points directly to Heroku
const checkCacheStatus = async (companyName: string) => {
  setIsLoading(true);
  setError(null);
  
  try {
    const apiBaseUrl = getApiBaseUrl();
    // This now points directly to the Heroku backend
    const response = await axios.get(`${apiBaseUrl}/api/cache-status/${companyName}`);
    console.log("Cache status response from Heroku:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking cache status:", error);
    setError("Failed to check cache status. Please try again.");
    return null;
  } finally {
    setIsLoading(false);
  }
};

const generateAnalysis = async (companyName: string) => {
  setIsLoading(true);
  setError(null);
  
  try {
    const apiBaseUrl = getApiBaseUrl();
    // This now points directly to the Heroku backend
    const response = await axios.post(`${apiBaseUrl}/api/analyze`, { companyName });
    console.log("Analysis response from Heroku:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error generating analysis:", error);
    setError("Failed to generate analysis. Please try again.");
    return null;
  } finally {
    setIsLoading(false);
  }
}; 