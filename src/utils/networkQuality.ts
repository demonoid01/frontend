export interface VideoQualities {
  "480p": string;
  "720p": string;
  "1080p": string;
}

export type QualityLevel = "480p" | "720p" | "1080p";

export class NetworkQualityDetector {
  private static instance: NetworkQualityDetector;
  private connectionInfo: any = null;
  private qualityLevel: QualityLevel = "720p";

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
}

// Helper function to get video URL based on network quality
export const getOptimalVideoUrl = (qualities: VideoQualities): string => {
  return NetworkQualityDetector.getInstance().getVideoUrl(qualities);
};

// Helper function to get current quality level
export const getCurrentQualityLevel = (): QualityLevel => {
  return NetworkQualityDetector.getInstance().getOptimalQuality();
};
