// Loading skeleton components for better UX

export function TrackCardSkeleton({ className = "" }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse ${className}`}>
      <div className="relative aspect-square mb-3 bg-white/20 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-white/20 rounded w-3/4"></div>
        <div className="h-3 bg-white/20 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function AlbumCardSkeleton({ className = "" }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse ${className}`}>
      <div className="relative aspect-square mb-3 bg-white/20 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-white/20 rounded w-4/5"></div>
        <div className="h-3 bg-white/20 rounded w-2/3"></div>
      </div>
    </div>
  );
}

export function GenreCardSkeleton({ className = "" }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse ${className}`}>
      <div className="relative aspect-square bg-white/20 rounded-lg"></div>
    </div>
  );
}

export function ArtistCardSkeleton({ className = "" }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse ${className}`}>
      <div className="relative aspect-square mb-3 bg-white/20 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
        <div className="h-3 bg-white/20 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="animate-pulse mb-8">
      <div className="h-8 bg-white/20 rounded w-48 mb-4"></div>
      <div className="h-4 bg-white/20 rounded w-64"></div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          {/* Back button skeleton */}
          <div className="h-6 bg-white/20 rounded w-32 mb-8"></div>
          
          {/* Content skeleton */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image skeleton */}
              <div className="aspect-square bg-white/20 rounded-lg"></div>
              
              {/* Info skeleton */}
              <div className="space-y-4">
                <div className="h-10 bg-white/20 rounded w-3/4"></div>
                <div className="h-8 bg-white/20 rounded w-1/2"></div>
                <div className="h-6 bg-white/20 rounded w-2/3"></div>
                <div className="flex space-x-4 mt-6">
                  <div className="h-12 bg-white/20 rounded w-32"></div>
                  <div className="h-12 bg-white/20 rounded w-40"></div>
                </div>
                <div className="space-y-2 mt-6">
                  <div className="h-4 bg-white/20 rounded w-full"></div>
                  <div className="h-4 bg-white/20 rounded w-5/6"></div>
                  <div className="h-4 bg-white/20 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrackListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg animate-pulse">
          <div className="w-8 h-4 bg-white/20 rounded"></div>
          <div className="w-10 h-10 bg-white/20 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-3 bg-white/20 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-white/20 rounded w-12"></div>
        </div>
      ))}
    </div>
  );
}
