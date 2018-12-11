'use strict';
const inputList = document.querySelectorAll('input[type = text]');
const textareaList = document.querySelectorAll('textarea');

const elementWraping = (elem) => {
    const newElem = elem.cloneNode(true);
    const span = document.createElement('span');
    elem.parentElement.insertBefore(span, elem);
    span.appendChild(newElem);

    if (elem.tagName === 'INPUT') {
        span.classList.add('text-wrapper');
    } else {
        span.classList.add('textarea-wrapper');
    }
    elem.parentElement.removeChild(elem);
};

inputList.forEach((elem) => { // wraps all inputs
    elementWraping(elem);
});

textareaList.forEach((elem) => { // wraps all inputs
    elementWraping(elem);
});

const cssPropertiesDelegation = (target, position) => { // delegate both margin and display properties to wrapper
    const targetStyle = getComputedStyle(target);
    const targetMargin = targetStyle.margin;
    const targetDisplay = targetStyle.display;
    target.parentElement.style.margin = targetMargin + '';
    target.parentElement.style.display = targetDisplay;
    target.style.margin = '0';
    target.style.display = 'inline-block';
    const parent = target.parentElement;

    if (target.tagName === 'TEXTAREA') { // special position for 'x' due to textarea overflow property
        const targetHeight = parseInt(targetStyle.height) - 20;
        if (position.position === 'right') {
            const button = parent.children[1];
            button.style.transform = `translateY(-${targetHeight}px) translateX(-35px)`;
        } else {
            const button = parent.children[0];
            button.style.transform = `translateY(-${targetHeight}px) translateX(+35px)`;
        }
        target.classList.remove(`${position.position}-side-button`);
        target.classList.add(`${position.position}-side-button-textarea`);
    }
    if (target.value) { // if value of tag is not empty - show cross
        parent.classList.add(`active-wrapper-${position.position}`);

        if (position.position === 'right') {
            const button = parent.children[1];
            button.classList.add('active-button')
        } else {
            const button = parent.children[0];
            button.classList.add('active-button')
        }
    }
};

Object.prototype.setClearButton = function (position = {'position': 'right'}) { // method for clearing buttons
    const button = document.createElement('button');
    button.classList.add('clear');
    button.innerText = 'x';
    this.classList.add(`${position.position}-side-button`);

    if (position.position === 'right') {
        this.parentElement.appendChild(button);// button inserts after input
        this.nextElementSibling.classList.add('right') // position of button
    } else {
        this.parentElement.insertBefore(button, this);
        this.previousElementSibling.classList.add('left');
    }
    cssPropertiesDelegation(this, position);

    button.addEventListener('click', function (event) { // clear a target field on cross click and also hide cross
        const parent = this.parentElement;
        const currentInput = position.position === 'right' ? parent.children[0] : parent.children[1];
        currentInput.value = '';
        currentInput.focus();
        (event.target).classList.remove('active-button');
        parent.classList.remove(`active-wrapper-${position.position}`)
    });

    this.addEventListener('input', function (event) { // if something in area- shows button
        const parent = this.parentElement;
        const currentButton = position.position === 'right' ? parent.children[1] : parent.children[0];
        if (event.target.value) {
            currentButton.classList.add('active-button');
            parent.classList.add(`active-wrapper-${position.position}`);
        } else {
            currentButton.classList.remove('active-button');
            parent.classList.remove(`active-wrapper-${position.position}`);
        }
    });
};

const newInputList = document.querySelectorAll('input');
const newTextareaList = document.querySelectorAll('textarea');

newInputList.forEach((elem) => elem.setClearButton());
newTextareaList.forEach((elem) => elem.setClearButton({
    'position': 'left'
}));
