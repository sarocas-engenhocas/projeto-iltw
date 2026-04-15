let filmesCarrossel = [];

carregarDados()
    .then(data => {
        filmesCarrossel = [...data.filmes].sort((a, b) => b.rating - a.rating).slice(0, 3);
        const slidesData = [
            { id: "title1", year: "year1", genre: "genre1", producer: "producer1", rating: "rating1", img: "img1" },
            { id: "title2", year: "year2", genre: "genre2", producer: "producer2", rating: "rating2", img: "img2" },
            { id: "title3", year: "year3", genre: "genre3", producer: "producer3", rating: "rating3", img: "img3" }
        ];
        slidesData.forEach((s, i) => {
            const f = filmesCarrossel[i];
            document.getElementById(s.id).textContent = f.titulo;
            document.getElementById(s.year).textContent = "Ano: " + f.ano;
            document.getElementById(s.genre).textContent = "Género: " + f.genero;
            document.getElementById(s.producer).textContent = "Produtora: " + f.produtora;
            document.getElementById(s.rating).innerHTML = "Rating: " + f.rating + " " + starsHtml(f.rating);
            document.getElementById(s.img).src = f.poster;
        });
    })
    .catch(err => console.error("Erro ao carregar carrossel:", err));

const track = document.querySelector('.carousel__track');
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel__button--right');
    const prevButton = document.querySelector('.carousel__button--left');
    const dotsNav = document.querySelector('.carousel__nav');
    const dots = Array.from(dotsNav.children);
    function recalcSlidePositions() {
        const sw = slides[0].getBoundingClientRect().width;
        slides.forEach((slide, i) => { slide.style.left = sw * i + 'px'; });
        const current = track.querySelector('.current-slide');
        if (current) track.style.transform = 'translateX(-' + current.style.left + ')';
    }
    recalcSlidePositions();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(recalcSlidePositions, 150);
    });

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-slide');
        currentDot.removeAttribute('aria-current');
        targetDot.classList.add('current-slide');
        targetDot.setAttribute('aria-current', 'true');
    };

    const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
        if (targetIndex === 0) {
            prevButton.classList.add('is-hidden');
            nextButton.classList.remove('is-hidden');
        } else if (targetIndex === slides.length - 1) {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.add('is-hidden');
        } else {
            prevButton.classList.remove('is-hidden');
            nextButton.classList.remove('is-hidden');
        }
    };

    function irParaSlide(index) {
        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-slide');
        const targetSlide = slides[index];
        const targetDot = dots[index];
        if (!targetSlide || targetSlide === currentSlide) return;
        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, index);
    }

    function proximoSlide() {
        const current = track.querySelector('.current-slide');
        const idx = slides.indexOf(current);
        if (idx < slides.length - 1) {
            irParaSlide(idx + 1);
        } else {
            irParaSlide(0);
        }
    }

    function slideAnterior() {
        const current = track.querySelector('.current-slide');
        const idx = slides.indexOf(current);
        if (idx > 0) {
            irParaSlide(idx - 1);
        } else {
            irParaSlide(slides.length - 1);
        }
    }

    prevButton.addEventListener('click', slideAnterior);
    nextButton.addEventListener('click', proximoSlide);

    slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
            if (filmesCarrossel[i]) {
                window.location.href = `filme.html?id=${filmesCarrossel[i].id}`;
            }
        });
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        irParaSlide(targetIndex);
    });

    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) < 50) return;
        if (diff > 0) {
            proximoSlide();
        } else {
            slideAnterior();
        }
    }, { passive: true });

    let autoplayTimer;
    function iniciarAutoplay() {
        pararAutoplay();
        autoplayTimer = setInterval(proximoSlide, 4000);
    }
    function pararAutoplay() {
        clearInterval(autoplayTimer);
    }
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', pararAutoplay);
    carousel.addEventListener('mouseleave', iniciarAutoplay);

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') slideAnterior();
        else if (e.key === 'ArrowRight') proximoSlide();
    });

    iniciarAutoplay();
}
