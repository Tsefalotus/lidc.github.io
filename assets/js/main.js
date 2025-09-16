document.addEventListener("DOMContentLoaded", function () {
  // Устанавливаем атрибуты playsinline и muted для всех видео
  document.querySelectorAll('.lazy-video').forEach((video) => {
    video.setAttribute('playsinline', 'true');
    video.setAttribute('muted', 'true');
  });

  const videos = document.querySelectorAll(".lazy-video");
  const modal = document.getElementById("youtube-modal");
  const iframe = document.getElementById("youtube-iframe");
  const closeModal = document.querySelector(".close-modal");

  // Функция для определения мобильного устройства
  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  // Функция для определения iOS
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // Функция для определения Android
  function isAndroid() {
    return /Android/.test(navigator.userAgent);
  }

  // Функция для определения десктопа
  function isDesktop() {
    return !isMobile() && !isIOS() && !isAndroid();
  }

  // Наблюдатель для видео-превью
  const observerOptions = {
    root: null,
    threshold: 0.5,
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      if (entry.isIntersecting) {
        console.log("Playing video:", video);
        video.play();
      } else {
        console.log("Pausing video:", video);
        video.pause();
      }
    });
  }, observerOptions);

  // Наблюдаем за каждым видео
  videos.forEach((video) => {
    videoObserver.observe(video);
  });

  // Функция для открытия видео на iOS
  function openVideoOnIOS(videoId) {
    // Ставим на паузу все видео-превью
    videos.forEach((video) => {
      if (!video.paused) {
        console.log("Pausing video:", video);
        video.pause();
      }
    });

    // Отключаем IntersectionObserver временно
    videoObserver.disconnect();

    // Создаём прямую ссылку на YouTube видео для iOS
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Открываем видео в том же окне (запустит AVPlayer)
    window.location.href = youtubeUrl;
    
    // Возвращаем IntersectionObserver через задержку
    setTimeout(() => {
      videos.forEach((video) => {
        videoObserver.observe(video);
      });
    }, 2000);
  }

  // Надёжная функция для открытия видео на Android
  function openVideoOnAndroid(videoId) {
    // Ставим на паузу все видео-превью
    videos.forEach((video) => {
      if (!video.paused) {
        console.log("Pausing video:", video);
        video.pause();
      }
    });

    // Отключаем IntersectionObserver временно
    videoObserver.disconnect();

    // Множественный подход для максимальной совместимости
    const attempts = [
      // Метод 1: Intent URL с fallback
      () => {
        const intentUrl = `intent://www.youtube.com/watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;S.browser_fallback_url=https%3A//www.youtube.com/watch%3Fv%3D${videoId};end;`;
        window.location.href = intentUrl;
      },
      
      // Метод 2: YouTube app scheme
      () => {
        const youtubeAppUrl = `vnd.youtube://${videoId}`;
        const link = document.createElement('a');
        link.href = youtubeAppUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      
      // Метод 3: Универсальная ссылка YouTube
      () => {
        const youtubeUrl = `https://youtu.be/${videoId}`;
        window.open(youtubeUrl, '_blank');
      },
      
      // Метод 4: Обычная ссылка YouTube (fallback)
      () => {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        window.open(youtubeUrl, '_blank');
      }
    ];

    // Пытаемся выполнить методы по очереди
    let currentAttempt = 0;
    
    function tryNextMethod() {
      if (currentAttempt < attempts.length) {
        try {
          console.log(`Trying method ${currentAttempt + 1} for Android`);
          attempts[currentAttempt]();
          currentAttempt++;
          
          // Если первые методы не сработали, пробуем следующий через короткую задержку
          if (currentAttempt < 3) {
            setTimeout(tryNextMethod, 1000);
          }
        } catch (error) {
          console.log(`Method ${currentAttempt + 1} failed:`, error);
          currentAttempt++;
          tryNextMethod();
        }
      }
    }
    
    // Начинаем попытки
    tryNextMethod();
    
    // Возвращаем IntersectionObserver через задержку
    setTimeout(() => {
      videos.forEach((video) => {
        videoObserver.observe(video);
      });
    }, 3000);
  }

  // Функция для открытия модального окна (только ПК)
  function openModal(videoId) {
    if (!iframe) {
      console.error("Iframe with ID 'youtube-iframe' not found");
      return;
    }

    // Ставим на паузу все видео-превью
    videos.forEach((video) => {
      if (!video.paused) {
        console.log("Pausing video:", video);
        video.pause();
      }
    });

    // Отключаем IntersectionObserver временно
    videoObserver.disconnect();

    // Устанавливаем ссылку на YouTube-видео
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&vq=hd1080`;
    modal.style.display = 'flex';
  }

  // Универсальная функция для открытия видео
  function openVideo(videoId) {
    if (isIOS()) {
      // На iOS открываем в AVPlayer
      openVideoOnIOS(videoId);
    } else if (isAndroid()) {
      // На Android пытаемся открыть в приложении YouTube
      openVideoOnAndroid(videoId);
    } else {
      // На ПК открываем модальное окно
      openModal(videoId);
    }
  }

  // Обработчик кликов на "View full video" (для всех устройств)
  document.querySelectorAll('.view-full-video').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const videoId = button.dataset.videoId;
      openVideo(videoId);
    });
  });

  // Обработчики для контейнеров видео
  document.querySelectorAll('.video-container').forEach((container) => {
    const button = container.querySelector('.view-full-video');
    
    if (button) {
      const videoId = button.dataset.videoId;
      
      // Обработчик для всего превью на мобильных устройствах
      if (isMobile()) {
        container.addEventListener('click', (event) => {
          // Проверяем, что клик не был на кнопке .view-full-video
          if (!event.target.closest('.view-full-video')) {
            event.preventDefault();
            openVideo(videoId);
          }
        });
      }
    }
  });

  // Закрытие модального окна при клике на кнопку закрытия (только для ПК)
  if (closeModal && isDesktop()) {
    closeModal.addEventListener('click', () => {
      if (iframe) {
        iframe.src = '';
      }
      modal.style.display = 'none';

      // Включаем IntersectionObserver снова
      videos.forEach((video) => {
        videoObserver.observe(video);
      });
    });
  }

  // Закрытие модального окна при клике на пустое место (только для ПК)
  if (modal && isDesktop()) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        if (iframe) {
          iframe.src = '';
        }
        modal.style.display = 'none';

        // Включаем IntersectionObserver снова
        videos.forEach((video) => {
          videoObserver.observe(video);
        });
      }
    });
  }

  // Обработчики для overlay на мобильных устройствах
  document.querySelectorAll('.video-container').forEach((container) => {
    const overlay = container.querySelector('.overlay');
    
    if (overlay) {
      // Показать overlay при касании
      container.addEventListener('touchstart', () => {
        overlay.style.opacity = '1';
      });
      
      // Скрыть overlay при окончании касания
      container.addEventListener('touchend', () => {
        setTimeout(() => {
          overlay.style.opacity = '0';
        }, 1000);
      });
      
      // Показать overlay при клике (для устройств с мышью)
      container.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
      });
      
      // Скрыть overlay при уходе мыши
      container.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
      });
    }
  });

  // Обработчик для возврата на страницу (для мобильных устройств)
  if (isMobile()) {
    window.addEventListener('focus', () => {
      // Когда пользователь возвращается на страницу, возобновляем работу observer
      setTimeout(() => {
        videos.forEach((video) => {
          videoObserver.observe(video);
        });
      }, 1000);
    });

    window.addEventListener('pageshow', (event) => {
      // Обрабатываем возврат через кнопку "Назад"
      if (event.persisted) {
        setTimeout(() => {
          videos.forEach((video) => {
            videoObserver.observe(video);
          });
        }, 1000);
      }
    });
  }

  // Дополнительный обработчик для Android - отслеживание видимости страницы
  if (isAndroid()) {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Пользователь вернулся на страницу, возобновляем observer
        setTimeout(() => {
          videos.forEach((video) => {
            videoObserver.observe(video);
          });
        }, 500);
      }
    });
  }
});