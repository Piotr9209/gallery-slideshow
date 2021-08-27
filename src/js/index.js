import "../scss/main.scss";
import 'regenerator-runtime/runtime';

let page = 1;
let limit = 5;
let counter = 0;
let currentCounter = 1;
let arrayWithDataJson = [];

const gallery = document.querySelector('.gallery');
const article = document.createElement('article');
const fullSizeImage = document.createElement('section')
const btnNextJsonImages = document.querySelector('.btn-nextJson-images');
const hr = document.querySelector('hr');
const startSlideshow = document.querySelector('.start-slideshow');

const loadImagesJson = () => {
    page++;
    getImages();
};

btnNextJsonImages.addEventListener('click', loadImagesJson);

const getImages = () => {
    const url = `http://localhost:3000/info/?_page=${page}&_limit=${limit}`
    fetch(url)
        .then((res) => {
            return res.json()
        })
        .then(data => {
            showImages(data)
        })
        .catch(err => console.log(err))
};


const showImages = (images) => {
    if (images.length === 0) {
        btnNextJsonImages.setAttribute('disabled', true);
    } else {
        images.forEach(image => {
            const item = document.createElement('div');
            item.className = 'gallery-image';
            item.dataset.id = counter;
            item.innerHTML = `
            <img src="${image.images.thumbnail}" />
            <div>
            <h1>${image.name}</h1>
            <p>${image.artist.name}</p> 
            </div>
            `;
            arrayWithDataJson.push(item);
            counter++;
            gallery.appendChild(item);
            item.addEventListener('click', () => imageDetail(image));
            startSlideshow.addEventListener('click', () => slideShow(image));
        });
    };
}

function slideShow(image) {
    startSlideshow.innerHTML = 'stop slideshow';
    console.log(image);
}

function imageDetail(oneImage) {
    currentCounter = oneImage.id;
    article.className = 'article-information';
    article.innerHTML = `
    <div class="article-container">
    <img src="${oneImage.images.hero.small}" />
    <div>
    <button class='bigIMG'>view image</button>
    </div>
    <div>
    <h1>${oneImage.name}</h1>
    <p>${oneImage.artist.name}</p>
    </div>
    </div>
    <div class="smallIMG">
    <img src="${oneImage.artist.image}"/>
    </div>
    <div class="artist-description">
    <p>${oneImage.year}</p>
    <p>${oneImage.description}</p>
    <div class="nav-button">
    <a href="${oneImage.source}" target="_blank">go to source</a>
    <a class="prev-to-gallery" href="#">back to gallery</a>
    </div>
    </div>
    <hr class="progress-bar"/>
    <footer>
    <div><p>${oneImage.name}</p><p>${oneImage.artist.name}</p></div>
    <div>
    <button class="prevIMG">prev img</button>
    <button class="nextIMG">next img</button>
    </div>
    </footer>
    `;

    gallery.style.display = 'none';
    btnNextJsonImages.setAttribute('disabled', true);
    hr.after(article);
    if (article.style.display === 'none') {
        article.style.display = 'block';
    };

    const nextIMG = document.querySelector('.nextIMG');
    nextIMG.addEventListener('click', () => {
        currentCounter++;
        const url = `http://localhost:3000/info/${currentCounter}`
        fetch(url)
            .then((res) => {
                return res.json()
            })
            .then(data => {
                return imageDetail(data, currentCounter)
            })
            .catch(err => console.log(err))
    });

    const prevIMG = document.querySelector('.prevIMG');
    prevIMG.addEventListener('click', () => {
        currentCounter--;
        const url = `http://localhost:3000/info/${currentCounter}`
        fetch(url)
            .then((res) => {
                return res.json()
            })
            .then(data => {
                return imageDetail(data, currentCounter)
            })
            .catch(err => console.log(err))
    });


    setDisabledButtonInImageDetail(currentCounter, arrayWithDataJson, nextIMG, prevIMG);

    const btnPrevToGallery = document.querySelector('.prev-to-gallery');
    btnPrevToGallery.addEventListener('click', () => backToGallery());

    const bigIMG = document.querySelector('.bigIMG');
    bigIMG.addEventListener('click', () => showBigIMG(oneImage))
}

function setDisabledButtonInImageDetail(currentCounter, arrayWithDataJson, nextIMG, prevIMG) {
    if (currentCounter === arrayWithDataJson.length) {
        nextIMG.setAttribute('disabled', true);
    } if (currentCounter === 44) {
        nextIMG.setAttribute('disabled', true);
    }
    if (currentCounter === 1) {
        prevIMG.setAttribute('disabled', true);
    }
};

function backToGallery() {
    article.style.display = 'none';
    gallery.removeAttribute("style");
    btnNextJsonImages.removeAttribute('disabled');
}

function showBigIMG(detailsIMG) {
    fullSizeImage.className = 'full-size-image';
    fullSizeImage.innerHTML = `
    <div class="modal-img">
    <span class='back-to-image-details clearfix'>CLOSE</span>
    <img src="${detailsIMG.images.hero.small}"/>
    </div>
    `
    article.after(fullSizeImage);
    const btnPrevToGallery = document.querySelector('.prev-to-gallery');
    btnPrevToGallery.style.display = 'none';

    if (fullSizeImage.style.display === 'none') {
        fullSizeImage.style.display = 'block';
    };
    const backToImageDetails = document.querySelector('.back-to-image-details');
    backToImageDetails.addEventListener('click', () => showImageDetails(btnPrevToGallery));
}

function showImageDetails(btnPrevToGallery) {
    fullSizeImage.style.display = 'none';
    btnPrevToGallery.style.display = 'inline-block';
}

window.addEventListener('DOMContentLoaded', () => getImages());