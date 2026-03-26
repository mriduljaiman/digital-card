'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2, Download, ExternalLink, Check } from 'lucide-react';

interface StockPhoto {
  id: string;
  description: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    profileUrl: string;
  };
  downloadLocation: string;
  width: number;
  height: number;
  color: string;
}

interface StockPhotoBrowserProps {
  onSelectPhoto?: (photo: StockPhoto) => void;
  defaultQuery?: string;
}

const CATEGORY_QUERIES = {
  wedding: 'wedding ceremony elegant',
  birthday: 'birthday celebration party',
  engagement: 'engagement ring couple love',
  anniversary: 'anniversary romantic celebration',
  babyShower: 'baby shower nursery cute',
  decorations: 'event decorations elegant',
  flowers: 'flowers bouquet elegant',
  nature: 'nature landscape beautiful',
};

export function StockPhotoBrowser({ onSelectPhoto, defaultQuery = 'wedding' }: StockPhotoBrowserProps) {
  const [photos, setPhotos] = useState<StockPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(defaultQuery);
  const [searchInput, setSearchInput] = useState(defaultQuery);
  const [category, setCategory] = useState<keyof typeof CATEGORY_QUERIES>('wedding');
  const [orientation, setOrientation] = useState('landscape');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, [query, orientation, page]);

  const fetchPhotos = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        query,
        page: page.toString(),
        perPage: '12',
        orientation,
      });

      const response = await fetch(`/api/stock/photos?${params}`);
      const data = await response.json();

      if (data.success) {
        setPhotos(data.data.photos);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setQuery(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (value: keyof typeof CATEGORY_QUERIES) => {
    setCategory(value);
    const categoryQuery = CATEGORY_QUERIES[value];
    setSearchInput(categoryQuery);
    setQuery(categoryQuery);
    setPage(1);
  };

  const handleSelectPhoto = async (photo: StockPhoto) => {
    setSelectedPhotoId(photo.id);

    // Track download with Unsplash
    try {
      await fetch('/api/stock/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          downloadLocation: photo.downloadLocation,
        }),
      });
    } catch (error) {
      console.error('Error tracking download:', error);
    }

    if (onSelectPhoto) {
      onSelectPhoto(photo);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Browse Stock Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="flex gap-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for photos..."
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Select
            value={orientation}
            onValueChange={setOrientation}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landscape">Landscape</SelectItem>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="squarish">Square</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Quick Select */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(CATEGORY_QUERIES).map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={category === cat ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(cat as keyof typeof CATEGORY_QUERIES)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-royal-gold transition-all"
                  onClick={() => handleSelectPhoto(photo)}
                  style={{ backgroundColor: photo.color }}
                >
                  <img
                    src={photo.urls.small}
                    alt={photo.description || 'Stock photo'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex justify-end gap-2">
                      {selectedPhotoId === photo.id && (
                        <div className="bg-green-500 text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="text-white">
                      <p className="text-xs truncate mb-1">
                        {photo.description || 'Untitled'}
                      </p>
                      <div className="flex items-center justify-between">
                        <a
                          href={photo.user.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs hover:underline flex items-center gap-1"
                        >
                          {photo.user.name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-xs">
                          {photo.width} × {photo.height}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Attribution */}
            <p className="text-xs text-muted-foreground text-center pt-4">
              Photos provided by{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Unsplash
              </a>
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
