var NAME_FONT = {
    'D': ["11110","10001","10001","10001","10001","10001","11110"],
    'A': ["01110","10001","10001","11111","10001","10001","10001"],
    'W': ["10001","10001","10001","10101","10101","10101","01010"],
    'N': ["10001","11001","10101","10101","10011","10001","10001"],
    'G': ["01111","10000","10000","10011","10001","10001","01110"],
    'B': ["11110","10001","10001","11110","10001","10001","11110"],
    'R': ["11110","10001","10001","11110","10100","10010","10001"],
    'I': ["11111","00100","00100","00100","00100","00100","11111"],
    'E': ["11111","10000","10000","11110","10000","10000","11111"],
    'L': ["10000","10000","10000","10000","10000","10000","11111"]
};

document.addEventListener('DOMContentLoaded', function () {

    // Scrolling marquee borders (dot-matrix banner trim)
    document.querySelectorAll('.ticker[data-pattern]').forEach(function (el) {
        var pattern = el.getAttribute('data-pattern');
        var strip = pattern.repeat(60);
        var offset = 0;
        var visibleChars = 90;
        function tick() {
            el.textContent = strip.slice(offset, offset + visibleChars);
            offset = (offset + 1) % pattern.length;
        }
        tick();
        setInterval(tick, 320);
    });

    // Typewriter reveal for taglines
    document.querySelectorAll('[data-typewriter]').forEach(function (el) {
        var text = el.getAttribute('data-typewriter');
        el.textContent = '';
        var cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.textContent = '_';
        el.appendChild(cursor);
        var i = 0;
        function typeChar() {
            if (i < text.length) {
                cursor.insertAdjacentText('beforebegin', text.charAt(i));
                i++;
                setTimeout(typeChar, 90);
            }
        }
        setTimeout(typeChar, 400);
    });

    // Dot-matrix name banner: built as a grid of square cells so it
    // stays crisp at any size instead of relying on font glyph rendering.
    document.querySelectorAll('.banner-grid[data-words]').forEach(function (el) {
        var words = el.getAttribute('data-words').split(' ');
        var rowCount = 7;
        var wordSpacing = 2;
        var rows = [];
        for (var r = 0; r < rowCount; r++) rows.push([]);

        words.forEach(function (word, wi) {
            for (var i = 0; i < word.length; i++) {
                var glyph = NAME_FONT[word.charAt(i)];
                for (var r = 0; r < rowCount; r++) {
                    for (var c = 0; c < glyph[r].length; c++) {
                        rows[r].push(glyph[r].charAt(c) === '1');
                    }
                    if (i !== word.length - 1) rows[r].push(false);
                }
            }
            if (wi !== words.length - 1) {
                for (var r2 = 0; r2 < rowCount; r2++) {
                    for (var g = 0; g < wordSpacing; g++) rows[r2].push(false);
                }
            }
        });

        var colCount = rows[0].length;
        el.style.gridTemplateColumns = 'repeat(' + colCount + ', var(--cell-size))';
        el.style.gridTemplateRows = 'repeat(' + rowCount + ', var(--cell-size))';
        el.textContent = '';

        var rowEls = rows.map(function (rowBits) {
            return rowBits.map(function (on) {
                var cell = document.createElement('div');
                cell.className = 'cell';
                if (on) cell.classList.add('on');
                return cell;
            });
        });

        // Reveal row by row, like a print head moving down the page
        var r = 0;
        function printRow() {
            if (r < rowEls.length) {
                rowEls[r].forEach(function (cell) { el.appendChild(cell); });
                r++;
                setTimeout(printRow, 220);
            }
        }
        printRow();
    });

});
