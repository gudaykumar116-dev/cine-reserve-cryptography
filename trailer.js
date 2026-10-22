// =====================================================================
// Universal Movie Poster & Trailer Handler
// =====================================================================

const MOVIE_POSTER_MAP = {
  'gladiator': 'images/gladiator2.jpg',
  'stree': 'images/stree2.jpg',
  'pathaan': 'images/pathaan.jpg',
  'animal': 'images/animal.png',
  'jawan': 'images/jawan.png',
  'pushpa': 'images/pushpa2.png',
  'baahubali': 'images/baahubali2.jpg',
  'rrr': 'images/rrr.jpg',
  'kalki': 'images/kalki.jpg',
  'salaar': 'images/salaar.jpg',
  'interstellar': 'images/interstellar.jpg',
  'dark knight': 'images/darkknight.jpg',
  'avatar': 'images/avatar.jpg',
  'oppenheimer': 'images/oppenheimer.png',
  'dangal': 'images/dangal.jpg'
};

const MOVIE_TRAILER_MAP = {
  'gladiator': 'https://www.youtube.com/watch?v=4rgYUipGJNo',
  'stree': 'https://www.youtube.com/watch?v=KVnhe_E5ioM',
  'pathaan': 'https://www.youtube.com/watch?v=vqu4z34wENw',
  'animal': 'https://www.youtube.com/watch?v=Dydmpfo68DA',
  'jawan': 'https://www.youtube.com/watch?v=MWOlnZSnXWE',
  'pushpa': 'https://www.youtube.com/watch?v=g3JUbgOIxZc',
  'baahubali': 'https://www.youtube.com/watch?v=G62HrubdD6o',
  'rrr': 'https://www.youtube.com/watch?v=GY4BgdUSpbE',
  'kalki': 'https://www.youtube.com/watch?v=y1-w1pUXW50',
  'salaar': 'https://www.youtube.com/watch?v=4GPvYMKtrtI',
  'interstellar': 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
  'dark knight': 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
  'avatar': 'https://www.youtube.com/watch?v=d9MyW72ELq0',
  'oppenheimer': 'https://www.youtube.com/watch?v=uYPbbksJxIg',
  'dangal': 'https://www.youtube.com/watch?v=x_7YlGv9u1g'
};

function getPosterForMovie(movie) {
  if (!movie) return 'images/rrr.jpg';
  const title = (movie.title || '').toLowerCase();
  
  for (const [key, poster] of Object.entries(MOVIE_POSTER_MAP)) {
    if (title.includes(key)) {
      return poster;
    }
  }

  if (movie.posterUrl && !movie.posterUrl.includes('tmdb.org') && !movie.posterUrl.includes('unsplash.com')) {
    return movie.posterUrl;
  }
  return 'images/rrr.jpg';
}

function getTrailerForMovie(movie) {
  if (!movie) return 'https://www.youtube.com/watch?v=zSWdZVtXT7E';
  const title = (movie.title || '').toLowerCase();

  for (const [key, trailer] of Object.entries(MOVIE_TRAILER_MAP)) {
    if (title.includes(key)) {
      return trailer;
    }
  }

  return movie.trailerUrl || 'https://www.youtube.com/watch?v=zSWdZVtXT7E';
}

function extractYouTubeVideoId(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return '';
}

function extractYouTubeEmbedUrl(url) {
  const videoId = extractYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  }
  return url || '';
}

function extractYouTubeWatchUrl(url) {
  const videoId = extractYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return url || 'https://www.youtube.com';
}

function openTrailerDirectly(trailerUrl, movieTitle) {
  let url = trailerUrl;
  const titleStr = movieTitle ? decodeURIComponent(movieTitle) : '';

  if (!url || url === '#' || url === 'undefined') {
    url = getTrailerForMovie({ title: titleStr });
  }

  const videoId = extractYouTubeVideoId(url);
  const targetUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : (url || 'https://www.youtube.com');

  // Directly open trailer in a new tab
  const newTab = window.open(targetUrl, '_blank', 'noopener,noreferrer');
  if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
    const a = document.createElement('a');
    a.href = targetUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 100);
  }
}

function openTrailer(trailerUrl, movieTitle) {
  openTrailerDirectly(trailerUrl, movieTitle);
}

function openTrailerModal(trailerUrl, movieTitle) {
  openTrailerDirectly(trailerUrl, movieTitle);
}

function showTrailerInModal(trailerUrl, movieTitle) {
  let modal = document.getElementById('trailer-modal');
  if (!modal) {
    createTrailerModal();
    modal = document.getElementById('trailer-modal');
  }

  let finalUrl = trailerUrl;
  let decodedTitle = movieTitle ? decodeURIComponent(movieTitle) : 'Official Movie Trailer';

  if (!finalUrl || finalUrl === '#' || finalUrl === 'undefined') {
    finalUrl = getTrailerForMovie({ title: decodedTitle });
  }

  const titleEl = document.getElementById('trailer-modal-title');
  if (titleEl) {
    titleEl.textContent = `${decodedTitle} – Official Trailer`;
  }

  const watchUrl = extractYouTubeWatchUrl(finalUrl);
  const embedUrl = extractYouTubeEmbedUrl(finalUrl);

  const extBtn = document.getElementById('trailer-external-btn');
  if (extBtn) {
    extBtn.href = watchUrl;
  }

  const fallbackLink = document.getElementById('trailer-fallback-link');
  if (fallbackLink) {
    fallbackLink.href = watchUrl;
  }

  const iframe = document.getElementById('trailer-iframe');
  if (iframe) {
    iframe.src = embedUrl;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTrailerModal() {
  const modal = document.getElementById('trailer-modal');
  if (modal) {
    modal.classList.remove('active');
    const iframe = document.getElementById('trailer-iframe');
    if (iframe) {
      iframe.src = ''; // Stops audio playback immediately
    }
  }
  document.body.style.overflow = '';
}

function createTrailerModal() {
  if (document.getElementById('trailer-modal')) return;

  const modalHtml = `
  <div id="trailer-modal" class="trailer-modal-overlay" onclick="if(event.target === this) closeTrailerModal()">
    <div class="trailer-modal-box">
      <div class="trailer-modal-header">
        <div class="trailer-modal-title">
          <span>🎬</span>
          <span id="trailer-modal-title">Official Movie Trailer</span>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <a id="trailer-external-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem;">
            <span>Watch on YouTube</span>
            <span>↗</span>
          </a>
          <button class="modal-close" style="position: static; font-size: 1.5rem; line-height: 1; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; background: rgba(255,255,255,0.08); border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); color: #fff;" onclick="closeTrailerModal()" title="Close Trailer">×</button>
        </div>
      </div>
      <div class="trailer-iframe-container">
        <iframe id="trailer-iframe" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div style="padding: 0.75rem 1.25rem; background: #070a12; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; gap: 0.5rem;">
        <span>💡 Playing in HD. Click Play or expand to Fullscreen anytime.</span>
        <a id="trailer-fallback-link" href="#" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: underline; font-weight: 500;">Open video on YouTube ↗</a>
      </div>
    </div>
  </div>`;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTrailerModal();
  }
});

// Ensure modal exists once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createTrailerModal();
});
