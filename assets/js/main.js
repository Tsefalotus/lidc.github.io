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
  const openModalLinks = document.querySelectorAll(".open-modal");

  let currentVideoPreview = null; // Переменная для хранения текущего видео-превью

  // Наблюдатель для видео-превью
  const observerOptions = {
    root: null,
    threshold: 0.5, // 50% элемента должно быть видно
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      if (entry.isIntersecting) {
        // Если видео пересекает 50% экрана, воспроизводим его
        console.log("Playing video:", video);
        video.play();
      } else {
        // Если видео выходит из зоны видимости, ставим на паузу
        console.log("Pausing video:", video);
        video.pause();
      }
    });
  }, observerOptions);

  // Наблюдаем за каждым видео
  videos.forEach((video) => {
    videoObserver.observe(video);
  });

  // Обработчик кликов на "View full video"
  document.querySelectorAll('.view-full-video').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      // Получаем ID видео из data-video-id
      const videoId = button.dataset.videoId;

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
      modal.style.display = 'flex'; // Показываем модальное окно
    });
  });

  // Закрытие модального окна при клике на пустое место
  modal.addEventListener('click', (event) => {
    // Проверяем, что клик был за пределами содержимого модального окна
    if (event.target === modal) {
      if (iframe) {
        iframe.src = ''; // Очищаем src, чтобы остановить видео
      }

      modal.style.display = 'none'; // Скрываем модальное окно

      // Включаем IntersectionObserver снова
      videos.forEach((video) => {
        videoObserver.observe(video); // Включаем наблюдение за всеми видео
      });

      console.log("Reactivating IntersectionObserver to resume video on screen.");
    }
  });

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
        }, 500); // Скрываем через 1 секунду
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
});