// Marketplace service for fetching marketplace data

interface MarketplaceAsset {
  id: number;
  assetid: string;
  title: string;
  game: string;
  gameId: string;
  price: string;
  steamPrice: string;
  image: string;
  genre: string;
  rarity: string;
  condition: string;
  isAuction: boolean;
  likes: number;
  timeLeft: string | null;
  steamMarketUrl: string;
  walletAddress: string;
  blobId: string;
  description?: string;
  uploadedAt: string;
}

interface MarketplaceResponse {
  success: boolean;
  assets: MarketplaceAsset[];
  count: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

class MarketplaceService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3111';
  }

  async getMarketplaceAssets(limit: number = 50, offset: number = 0): Promise<MarketplaceResponse> {
    try {
      console.log('[MarketplaceService] Fetching assets with params:', { limit, offset })
      console.log('[MarketplaceService] Base URL:', this.baseUrl)
      
      const url = `${this.baseUrl}/api/marketplace/assets?limit=${limit}&offset=${offset}`
      console.log('[MarketplaceService] Full URL:', url)
      
      const response = await fetch(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('[MarketplaceService] Response status:', response.status)
      console.log('[MarketplaceService] Response ok:', response.ok)

      if (!response.ok) {
        console.error('[MarketplaceService] Response not ok, status:', response.status, response.statusText)
        throw new Error(`Failed to fetch marketplace assets: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[MarketplaceService] Response data:', data)
      console.log('[MarketplaceService] Assets array:', data.assets)
      console.log('[MarketplaceService] Assets count from response:', data.count)
      return data;
    } catch (error) {
      console.error('[MarketplaceService] Error fetching marketplace assets:', error);
      throw error;
    }
  }

  async searchMarketplaceAssets(query: string, limit: number = 50): Promise<MarketplaceResponse> {
    try {
      // For now, get all assets and filter client-side
      // In the future, this could be enhanced with server-side search
      const response = await this.getMarketplaceAssets(limit);
      
      const filteredAssets = response.assets.filter(asset =>
        asset.title.toLowerCase().includes(query.toLowerCase()) ||
        asset.game.toLowerCase().includes(query.toLowerCase()) ||
        asset.description?.toLowerCase().includes(query.toLowerCase())
      );

      return {
        ...response,
        assets: filteredAssets,
        count: filteredAssets.length
      };
    } catch (error) {
      console.error('Error searching marketplace assets:', error);
      throw error;
    }
  }
}

export const marketplaceService = new MarketplaceService();
export type { MarketplaceAsset, MarketplaceResponse };
