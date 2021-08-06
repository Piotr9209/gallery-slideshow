import "../scss/main.scss";
import 'regenerator-runtime/runtime';

let page = 1;
let limit = 5;
let counter = 0;


const gallery = document.querySelector('.gallery');
const heading = document.querySelector('.heading');
const article = document.createElement('article');
const fullSizeImage = document.createElement('section')
const btnNextJsonImages = document.querySelector('.btn-nextJson-images');


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
        .then(data => showImages(data))
        .catch(err => console.log(err))
};

{/* <div class="gallery-image" data-id="0"> -- position relative
    <img src="" /> -- pelny obrazek
    <h1>title</h1> -- position absolute
    <p>description</p> -- position absolute
</div> */}

const showImages = (images) => {
    if (images.length === 0) {
        btnNextJsonImages.setAttribute('disabled', true);
    } else {
        images.forEach(image => {
            const { name } = image.name;
            const { thumbnail } = image.images;
            const { nameArtist } = image.artist.name;
            const item = document.createElement('div');
            item.className = 'gallery-image';
            item.dataset.id = counter; // - position relative
            item.innerHTML = `
            <img src="${thumbnail}" /> -- pelny obrazek
            <h1>${image.name}</h1> -- position absolute
            <p>${image.artist.name}</p> -- position absolute
            </div>
            `;
            counter++;
            gallery.appendChild(item);
            item.addEventListener('click', () => imageDetail(image))
        });
    }

}
function imageDetail(element) {
    const oneImage = element;
    article.className = 'article-information';
    article.innerHTML = `
    <div>
    <img class='bigIMG' src="${oneImage.images.hero.small}" />
    <button class='prev-to-gallery'> GO TO GALLERY </button>
    <h1>${oneImage.name}</h1>
    <p>${oneImage.artist.name}</p>
    </div>
    <div>
    <p>${oneImage.description}</p>
    </div>
    <footer>
    <button>prev img</button>
    <button>next img</button>
    </footer>
    `;
    gallery.style.display = 'none';
    heading.after(article);
    console.log(oneImage.images.hero.small)
    if (article.style.display === 'none') {
        article.style.display = 'block';
    }


    const btnPrevToGallery = document.querySelector('.prev-to-gallery');
    btnPrevToGallery.addEventListener('click', () => backToGallery());

    const bigIMG = document.querySelector('.bigIMG');
    bigIMG.addEventListener('click', () => showBigIMG(element))
}


function backToGallery() {
    article.style.display = 'none';
    gallery.style.display = 'block';
}

function showBigIMG(detailsIMG) {
    const imag = detailsIMG;
    fullSizeImage.className = 'full-size-image';
    fullSizeImage.innerHTML = `
    <button class='back-to-article-information'>CLOSE IMAGE</button>
    <img src="${imag.images.hero.large}"/>
    <p>${imag.name}</p>
    <p>${imag.description}</p>
    <h1>${imag.artist.name}</h1>
    `
    article.after(fullSizeImage);
}

window.addEventListener('DOMContentLoaded', () => getImages());

