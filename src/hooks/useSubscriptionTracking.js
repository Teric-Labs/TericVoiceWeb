/**
 * Custom hook for subscription tracking and usage management
 * Provides world-class subscription monitoring and upgrade prompts
 */

import { useState, useEffect, useCallback } from 'react';
import { subscriptionAPI, getCurrentUser } from '../services/api';

export const useSubscriptionTracking = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = getCurrentUser();

  // Fetch subscription status
  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user.uid) return;

    try {
      setIsLoading(true);
      const status = await subscriptionAPI.getSubscriptionStatus(user.uid);
      setSubscriptionStatus(status);
      return status;
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user.uid]);

  // Fetch usage stats
  const fetchUsageStats = useCallback(async () => {
    if (!user.uid) return;

    try {
      setIsLoading(true);
      const stats = await subscriptionAPI.getUsageStats(user.uid);
      setUsageStats(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching usage stats:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user.uid]);

  // Check if user can use a specific endpoint
  const checkEndpointAccess = useCallback(async (endpoint) => {
    if (!user.uid) return { allowed: false, message: 'User not authenticated' };

    try {
      const result = await subscriptionAPI.checkUsage(endpoint);
      return result;
    } catch (err) {
      console.error('Error checking endpoint access:', err);
      return { allowed: false, message: err.message };
    }
  }, [user.uid]);

  // Show upgrade prompt
  const showUpgradePrompt = useCallback((message) => {
    window.dispatchEvent(new CustomEvent('show-upgrade-modal', {
      detail: { message }
    }));
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchSubscriptionStatus(),
      fetchUsageStats()
    ]);
  }, [fetchSubscriptionStatus, fetchUsageStats]);

  // Auto-refresh on mount
  useEffect(() => {
    if (user.uid) {
      refreshData();
    }
  }, [user.uid, refreshData]);

  // Listen for subscription limit exceeded events
  useEffect(() => {
    const handleSubscriptionLimitExceeded = (event) => {
      const { message, endpoint } = event.detail;
      console.warn(`Subscription limit exceeded for ${endpoint}:`, message);
      showUpgradePrompt(message);
    };

    window.addEventListener('subscription-limit-exceeded', handleSubscriptionLimitExceeded);
    
    return () => {
      window.removeEventListener('subscription-limit-exceeded', handleSubscriptionLimitExceeded);
    };
  }, [showUpgradePrompt]);

  return {
    subscriptionStatus,
    usageStats,
    isLoading,
    error,
    fetchSubscriptionStatus,
    fetchUsageStats,
    checkEndpointAccess,
    showUpgradePrompt,
    refreshData,
    user
  };
};

/**
 * Hook for checking usage before API calls
 */
export const useUsageCheck = (endpoint) => {
  const [isChecking, setIsChecking] = useState(false);
  const [canUse, setCanUse] = useState(true);
  const [error, setError] = useState(null);

  const checkUsage = useCallback(async () => {
    if (!endpoint) return true;

    try {
      setIsChecking(true);
      setError(null);
      
      const result = await subscriptionAPI.checkUsage(endpoint);
      setCanUse(result.allowed);
      
      if (!result.allowed) {
        setError(result.message);
        // Trigger upgrade prompt
        window.dispatchEvent(new CustomEvent('show-upgrade-modal', {
          detail: { message: result.message }
        }));
      }
      
      return result.allowed;
    } catch (err) {
      console.error('Usage check failed:', err);
      setError(err.message);
      setCanUse(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [endpoint]);

  return {
    isChecking,
    canUse,
    error,
    checkUsage
  };
};

/**
 * Hook for displaying usage information
 */
export const useUsageDisplay = () => {
  const { usageStats, subscriptionStatus, isLoading } = useSubscriptionTracking();
  const [displayStats, setDisplayStats] = useState({});

  useEffect(() => {
    if (usageStats && subscriptionStatus) {
      const stats = {};
      
      // Process usage stats for display
      Object.entries(usageStats).forEach(([endpoint, data]) => {
        const limit = subscriptionStatus.tier_limits?.[endpoint] || 0;
        const used = data.used || 0;
        const remaining = Math.max(0, limit - used);
        
        stats[endpoint] = {
          used,
          limit,
          remaining,
          percentage: limit > 0 ? Math.round((used / limit) * 100) : 0,
          isNearLimit: limit > 0 && (used / limit) >= 0.8,
          isAtLimit: limit > 0 && used >= limit
        };
      });
      
      setDisplayStats(stats);
    }
  }, [usageStats, subscriptionStatus]);

  const getUsageForEndpoint = useCallback((endpoint) => {
    return displayStats[endpoint] || {
      used: 0,
      limit: 0,
      remaining: 0,
      percentage: 0,
      isNearLimit: false,
      isAtLimit: false
    };
  }, [displayStats]);

  const getOverallUsage = useCallback(() => {
    const endpoints = Object.keys(displayStats);
    if (endpoints.length === 0) return null;

    const totalUsed = endpoints.reduce((sum, endpoint) => sum + displayStats[endpoint].used, 0);
    const totalLimit = endpoints.reduce((sum, endpoint) => sum + displayStats[endpoint].limit, 0);
    
    return {
      totalUsed,
      totalLimit,
      totalRemaining: Math.max(0, totalLimit - totalUsed),
      percentage: totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0,
      isNearLimit: totalLimit > 0 && (totalUsed / totalLimit) >= 0.8,
      isAtLimit: totalLimit > 0 && totalUsed >= totalLimit
    };
  }, [displayStats]);

  return {
    displayStats,
    getUsageForEndpoint,
    getOverallUsage,
    isLoading,
    subscriptionStatus
  };
};

export default useSubscriptionTracking;
