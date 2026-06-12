let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let string = "";
let arr = Array.from(buttons);
arr.forEach(button => {
    button.addEventListener('click', (e) => {
        const val = e.target.innerHTML;
        if (val === '=') {
            try {
                string = eval(string).toString();
                input.value = string;
            } catch (err) {
                input.value = 'Error';
                string = '';
            }
        } else if (val === 'AC') {
            string = "";
            input.value = string;
        } else if (val === 'DEL') {
            string = string.toString().substring(0, string.toString().length - 1);
            input.value = string;
        } else {
            string += val;
            input.value = string;
        }
    });
});

// Make the input read-only and drive it from buttons/keyboard
input.setAttribute('readonly', '');

function flashButton(label) {
    const btn = arr.find(b => b.innerText === label);
    if (!btn) return;
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 120);
}

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if ((/^[0-9]$/).test(key)) {
        // Digit
        string += key;
        input.value = string;
        flashButton(key);
        return;
    }

    if (key === 'Enter' || key === '=') {
        // evaluate
        try {
            string = eval(string).toString();
            input.value = string;
        } catch (err) {
            input.value = 'Error';
            string = '';
        }
        flashButton('=');
        return;
    }

    if (key === 'Backspace') {
        string = string.toString().substring(0, string.toString().length - 1);
        input.value = string;
        flashButton('DEL');
        return;
    }

    if (key === 'Escape') {
        string = '';
        input.value = string;
        flashButton('AC');
        return;
    }

    // Operators and dot
    if (['+', '-', '*', '/', '%', '.'].includes(key)) {
        string += key;
        input.value = string;
        // use operator label for flash (dot is shown as .)
        flashButton(key === '*' ? '*' : key);
        return;
    }

    // ignore other keys
});