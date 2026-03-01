carregarDados()
    .then(data => {
        const top3 = [...data.filmes]
           .sort((a, b) => b.rating - a.rating)
           .slice(0, 3);

        document.getElementById("title1").textContent = top3[0].titulo;
        document.getElementById("year1").textContent = "Ano: " + top3[0].ano;
        document.getElementById("genre1").textContent = "Género: " + top3[0].genero;
        document.getElementById("producer1").textContent = "Produtora: " + top3[0].produtora;
        document.getElementById("rating1").textContent = "Rating: " + top3[0].rating;
        document.getElementById("img1").src = top3[0].poster;

        document.getElementById("title2").textContent = top3[1].titulo;
        document.getElementById("year2").textContent = "Ano: " + top3[1].ano;
        document.getElementById("genre2").textContent = "Género: " + top3[1].genero;
        document.getElementById("producer2").textContent = "Produtora: " + top3[1].produtora;
        document.getElementById("rating2").textContent = "Rating: " + top3[1].rating;
        document.getElementById("img2").src = top3[1].poster;

        document.getElementById("title3").textContent = top3[2].titulo;
        document.getElementById("year3").textContent = "Ano: " + top3[2].ano;
        document.getElementById("genre3").textContent = "Género: " + top3[2].genero;
        document.getElementById("producer3").textContent = "Produtora: " + top3[2].produtora;
        document.getElementById("rating3").textContent = "Rating: " + top3[2].rating;
        document.getElementById("img3").src = top3[2].poster;
    })
    .catch(err => console.error("Erro ao carregar carrossel:", err));

const track = document.querySelector('.carousel__track');
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel__button--right');
    const prevButton = document.querySelector('.carousel__button--left');
    const dotsNav = document.querySelector('.carousel__nav');
    const dots = Array.from(dotsNav.children);
    const slideWidth = slides[0].getBoundingClientRect().width;

    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

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

    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;
        const currentDot = dotsNav.querySelector('.current-slide');
        const prevDot = currentDot.previousElementSibling;
        const prevIndex = slides.findIndex(slide => slide === prevSlide);
        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
        hideShowArrows(slides, prevButton, nextButton, prevIndex);
    });

    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        const currentDot = dotsNav.querySelector('.current-slide');
        const nextDot = currentDot.nextElementSibling;
        const nextIndex = slides.findIndex(slide => slide === nextSlide);
        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;
        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-slide');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];
        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
        hideShowArrows(slides, prevButton, nextButton, targetIndex);
    });
}
