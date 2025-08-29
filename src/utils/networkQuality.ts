export interface VideoQualities {
  "480p": string;
  "720p": string;
  "1080p": string;
}

export type QualityLevel = "480p" | "720p" | "1080p";

export class NetworkQualityDetector {
  private static instance: NetworkQualityDetector;
  private connectionInfo: any = null;
  private qualityLevel: QualityLevel = "1080p"; // Start with highest quality
  private isAutoSwitching: boolean = false;
  private qualityAttempts: Map<QualityLevel, number> = new Map();

  private constructor() {
    this.initializeConnectionDetection();
  }

  public static getInstance(): NetworkQualityDetector {
    if (!NetworkQualityDetector.instance) {
      NetworkQualityDetector.instance = new NetworkQualityDetector();
    }
    return NetworkQualityDetector.instance;
  }

  private initializeConnectionDetection() {
    // Check if Network Information API is available
    if ('connection' in navigator) {
      this.connectionInfo = (navigator as any).connection;
      this.updateQualityBasedOnConnection();
      
      // Listen for connection changes
      this.connectionInfo.addEventListener('change', () => {
        this.updateQualityBasedOnConnection();
      });
    } else {
      // Fallback: Use a simple speed test
      this.detectQualityWithSpeedTest();
    }
  }

  private updateQualityBasedOnConnection() {
    if (!this.connectionInfo) return;

    const { effectiveType, downlink, rtt } = this.connectionInfo;
    
    // effectiveType: 'slow-2g', '2g', '3g', '4g'
    // downlink: download speed in Mbps
    // rtt: round trip time in milliseconds

    if (effectiveType === '4g' && downlink >= 10) {
      this.qualityLevel = "1080p";
    } else if (effectiveType === '4g' || (effectiveType === '3g' && downlink >= 5)) {
      this.qualityLevel = "720p";
    } else {
      this.qualityLevel = "480p";
    }

    console.log(`Network Quality: ${effectiveType}, Speed: ${downlink}Mbps, Quality: ${this.qualityLevel}`);
  }

  private async detectQualityWithSpeedTest() {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = performance.now();
      
      const latency = endTime - startTime;
      
      if (latency < 100) {
        this.qualityLevel = "1080p";
      } else if (latency < 300) {
        this.qualityLevel = "720p";
      } else {
        this.qualityLevel = "480p";
      }
      
      console.log(`Latency: ${latency}ms, Quality: ${this.qualityLevel}`);
    } catch (error) {
      // Default to 720p if speed test fails
      this.qualityLevel = "720p";
      console.log('Speed test failed, defaulting to 720p');
    }
  }

  public getOptimalQuality(): QualityLevel {
    return this.qualityLevel;
  }

  public getVideoUrl(qualities: VideoQualities): string {
    const quality = this.getOptimalQuality();
    return qualities[quality] || qualities["720p"] || qualities["480p"];
  }

  public async testConnectionSpeed(): Promise<number> {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = performance.now();
      
      return endTime - startTime;
    } catch (error) {
      return 1000; // Default high latency if test fails
    }
  }

  public forceQuality(quality: QualityLevel) {
    this.qualityLevel = quality;
    console.log(`Forced quality to: ${quality}`);
  }

  // New method for automatic quality switching based on loading time
  public async autoSwitchQuality(qualities: VideoQualities, onQualityChange: (quality: QualityLevel, url: string) => void): Promise<string> {
    if (this.isAutoSwitching) {
      return this.getVideoUrl(qualities);
    }

    this.isAutoSwitching = true;
    this.qualityAttempts.clear();

    // Start with 1080p
    let currentQuality: QualityLevel = "1080p";
    let currentUrl = qualities[currentQuality];

    // Try 1080p first
    const loadTime1080p = await this.measureVideoLoadTime(currentUrl);
    console.log(`1080p load time: ${loadTime1080p}ms`);

    if (loadTime1080p <= 1000) {
      // 1080p loads fast enough, use it
      this.qualityLevel = "1080p";
      this.isAutoSwitching = false;
      onQualityChange("1080p", currentUrl);
      return currentUrl;
    }

    // 1080p takes too long, switch to 720p
    currentQuality = "720p";
    currentUrl = qualities[currentQuality];
    console.log(`Switching to 720p due to slow 1080p loading`);

    const loadTime720p = await this.measureVideoLoadTime(currentUrl);
    console.log(`720p load time: ${loadTime720p}ms`);

    if (loadTime720p <= 1000) {
      // 720p loads fast enough
      this.qualityLevel = "720p";
      this.isAutoSwitching = false;
      onQualityChange("720p", currentUrl);
      return currentUrl;
    }

    // Both 1080p and 720p are slow, use 480p
    currentQuality = "480p";
    currentUrl = qualities[currentQuality];
    console.log(`Switching to 480p due to slow loading on higher qualities`);

    this.qualityLevel = "480p";
    this.isAutoSwitching = false;
    onQualityChange("480p", currentUrl);
    return currentUrl;
  }

  // Method to retry higher quality after some time
  public async retryHigherQuality(qualities: VideoQualities, onQualityChange: (quality: QualityLevel, url: string) => void): Promise<void> {
    if (this.qualityLevel === "1080p") return; // Already at highest quality

    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Try to upgrade quality
    if (this.qualityLevel === "480p") {
      const loadTime720p = await this.measureVideoLoadTime(qualities["720p"]);
      if (loadTime720p <= 1000) {
        this.qualityLevel = "720p";
        onQualityChange("720p", qualities["720p"]);
        console.log(`Upgraded to 720p after retry`);
      }
    } else if (this.qualityLevel === "720p") {
      const loadTime1080p = await this.measureVideoLoadTime(qualities["1080p"]);
      if (loadTime1080p <= 1000) {
        this.qualityLevel = "1080p";
        onQualityChange("1080p", qualities["1080p"]);
        console.log(`Upgraded to 1080p after retry`);
      }
    }
  }

  private async measureVideoLoadTime(url: string): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.muted = true;
      video.preload = 'metadata';
      
      const startTime = performance.now();
      
      const handleCanPlay = () => {
        const loadTime = performance.now() - startTime;
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.remove();
        resolve(loadTime);
      };

      const handleError = () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.remove();
        resolve(10000); // Very high load time for errors
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      video.src = url;
      
      // Timeout after 3 seconds
      setTimeout(() => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.remove();
        resolve(3000);
      }, 3000);
    });
  }
}

// Helper function to get video URL based on network quality
export const getOptimalVideoUrl = (qualities: VideoQualities): string => {
  return NetworkQualityDetector.getInstance().getVideoUrl(qualities);
};

// Helper function to get current quality level
export const getCurrentQualityLevel = (): QualityLevel => {
  return NetworkQualityDetector.getInstance().getOptimalQuality();
};

// Helper function for automatic quality switching
export const autoSwitchVideoQuality = async (
  qualities: VideoQualities, 
  onQualityChange: (quality: QualityLevel, url: string) => void
): Promise<string> => {
  return NetworkQualityDetector.getInstance().autoSwitchQuality(qualities, onQualityChange);
};

// Helper function to retry higher quality
export const retryHigherVideoQuality = async (
  qualities: VideoQualities, 
  onQualityChange: (quality: QualityLevel, url: string) => void
): Promise<void> => {
  return NetworkQualityDetector.getInstance().retryHigherQuality(qualities, onQualityChange);
};
