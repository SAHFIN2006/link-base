
export interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  mobile: boolean;
  screenWidth: number;
  screenHeight: number;
  deviceType: string;
  uniqueId: string;
  language: string;
  timezone: string;
  visitTime: string;
  referrer: string;
}

export function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent;
  
  // Generate a semi-persistent unique ID based on browser fingerprinting
  const generateUniqueId = () => {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency,
      navigator.deviceMemory,
      // Add more browser-specific attributes if needed
    ].join('|');
    
    // Create a simple hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(16);
  };
  
  // Browser and version detection
  const getBrowserInfo = () => {
    const browsers = {
      Chrome: /Chrome\/(\d+)/,
      Firefox: /Firefox\/(\d+)/,
      Safari: /Safari\/(\d+)/,
      Edge: /Edg\/(\d+)/, 
      Opera: /OPR\/(\d+)/,
      IE: /Trident\/(\d+)/
    };
    
    for (const [browser, regex] of Object.entries(browsers)) {
      const match = userAgent.match(regex);
      if (match) {
        return { 
          name: browser, 
          version: match[1] || "Unknown"
        };
      }
    }
    
    return { name: "Unknown", version: "Unknown" };
  };
  
  // OS detection
  const getOSInfo = () => {
    const osPatterns = {
      Windows: /Windows NT (\d+\.\d+)/,
      MacOS: /Mac OS X (\d+[._]\d+)/,
      iOS: /iPhone OS (\d+[._]\d+)/,
      Android: /Android (\d+\.\d+)/,
      Linux: /Linux/
    };
    
    for (const [os, regex] of Object.entries(osPatterns)) {
      const match = userAgent.match(regex);
      if (match) {
        let version = match[1] || "Unknown";
        // Clean up the version string
        version = version.replace(/_/g, '.');
        return { name: os, version };
      }
    }
    
    return { name: "Unknown", version: "Unknown" };
  };
  
  // Detect device type
  const getDeviceType = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    
    if (isTablet) return "Tablet";
    if (isMobile) return "Mobile";
    return "Desktop";
  };
  
  const browserInfo = getBrowserInfo();
  const osInfo = getOSInfo();
  
  return {
    browser: browserInfo.name,
    browserVersion: browserInfo.version,
    os: osInfo.name,
    osVersion: osInfo.version,
    mobile: /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    deviceType: getDeviceType(),
    uniqueId: generateUniqueId(),
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    visitTime: new Date().toISOString(),
    referrer: document.referrer || "Direct"
  };
}

export function trackDeviceInfo() {
  try {
    const deviceInfo = getDeviceInfo();
    
    // Get existing device analytics or initialize empty array
    let deviceAnalytics = [];
    try {
      const saved = localStorage.getItem('device_analytics');
      if (saved) {
        deviceAnalytics = JSON.parse(saved);
      }
    } catch (err) {
      console.error("Error parsing saved analytics", err);
    }
    
    // Add the new device info
    deviceAnalytics.push(deviceInfo);
    
    // Store back in localStorage (limit to last 100 entries to save space)
    if (deviceAnalytics.length > 100) {
      deviceAnalytics = deviceAnalytics.slice(-100);
    }
    
    localStorage.setItem('device_analytics', JSON.stringify(deviceAnalytics));
    
    return deviceInfo;
  } catch (error) {
    console.error("Error tracking device info:", error);
    return null;
  }
}
