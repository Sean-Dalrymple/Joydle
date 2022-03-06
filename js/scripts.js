var current_row = 0;
var current_letter = 0;
var length_number = 4;
var random_word = "";

function getRandomWord(word_length, language="en") {
    var word_array;
    if( language == "en")
        word_array = getWordList(word_length);
    else
        word_array = getWordListFr(word_length);
    random_word = word_array[Math.floor(Math.random() * word_array.length)].toUpperCase();
    document.getElementById("id_area").value = random_word;
    document.getElementById("id_guess_grid").className = "guess_grid";
    length_number = Number.parseInt(word_length);
    var grid_items = "";
    var letter_num = 0;
    var row_num = 0;
    
    for( letter_num = 0; letter_num < length_number; letter_num++ ) {
        grid_items = grid_items + `<div id="id_row_0_${letter_num}" class="current_row"><span id="id_letter_0_${letter_num}" ><span></div>`
    }
    
    for( row_num = 1; row_num <= length_number; row_num++ ) {
        for( letter_num = 0; letter_num < length_number; letter_num++ ) {
            grid_items = grid_items + `<div id="id_row_${row_num}_${letter_num}" class="following_row"><span id="id_letter_${row_num}_${letter_num}" ><span></div>`
        }
    }
    document.getElementById("id_guess_grid").style = `grid-template-columns: repeat(${word_length}, 1.5em); grid-template-rows: repeat(${length_number + 1}, 1.5em);`
    document.getElementById("id_guess_grid").innerHTML = grid_items;

    document.getElementById("id_definition").style = `width: 100%; visibility: collapse;`;
    if( language == "en")
        document.getElementById("id_definition").innerHTML = `<a target="_blank" href="https://www.dictionary.com/browse/${random_word.toLowerCase()}" style="margin: 0 auto;">see definition</a>`
    else
        document.getElementById("id_definition").innerHTML = `<a target="_blank" href="https://www.larousse.fr/dictionnaires/francais/${random_word.toLowerCase()}" style="margin: 0 auto;">see definition</a>`

    buildKeyboard();

    current_row = 0;
    current_letter = 0;
}

function buildKeyboard() {
    var topRow = "qwertyuiop".toUpperCase();
    var midRow = "asdfghjkl".toUpperCase();
    var lastRow = "zxcvbnm".toUpperCase();

    var rowHTML = `<div class="button_row">`;
    topRow.split("").forEach( (letter) => {
        rowHTML = rowHTML + `<button id="id_key_${letter}" type="button" onclick="enterLetter('${letter}')">${letter}</button>`
    });
    rowHTML = rowHTML + `</div>`;

    rowHTML = rowHTML + `<div class="button_row">`;
    midRow.split("").forEach( (letter) => {
        rowHTML = rowHTML + `<button id="id_key_${letter}" type="button" onclick="enterLetter('${letter}')">${letter}</button>`
    });
    rowHTML = rowHTML + `</div>`;

    rowHTML = rowHTML + `<div class="button_row">`;
    lastRow.split("").forEach( (letter) => {
        rowHTML = rowHTML + `<button id="id_key_${letter}" type="button" onclick="enterLetter('${letter}')">${letter}</button>`
    });
    rowHTML = rowHTML + `</div><div class="button_row">`;
    if(document.getElementById("id_setting_hints").checked) {
        rowHTML = rowHTML + '<button type="button" id="id_button_hint" onclick="hint()" style="width: 6rem; height: 2rem;">Hint</button>';
    }
    rowHTML = rowHTML + `<button type="button" onclick="submit()" style="width: 6rem; height: 2rem;">Check</button>`
    rowHTML = rowHTML + `<button type="button" onclick="backLetter()" style="width: 6rem; height: 2rem;">Delete</button>`
    rowHTML = rowHTML + `</div>`;

    document.getElementById("id_keyboard").innerHTML = rowHTML;
}

function enterLetter(letter) {
    if( current_letter < length_number && current_row <= length_number ) {
        document.getElementById(`id_letter_${current_row}_${current_letter}`).innerText = letter;
        current_letter++;
    }
}

function hint() {
    document.getElementById("id_button_hint").disabled = true;

    var check_array = random_word.split("");
    var unknown_chars = new Set();
    var unplaced_chars = new Set();

    check_array.forEach( (letter, index) => {
        console.log("class name = '" + document.getElementById(`id_key_${letter}`).className + "' for letter " + letter);
        if( document.getElementById(`id_key_${letter}`).className == "" ) {
            console.log("here");
            unknown_chars.add(letter);
        } else if( document.getElementById(`id_key_${letter}`).className == "key_letter_correct" ) {
            unplaced_chars.add(index);
        } else {
            unplaced_chars.add(index);
            var check_pos = 0;
            for( check_pos = 0 ; check_pos < (current_row - 1) ; check_pos++ ) {
                if( document.getElementById(`id_row_${check_pos}_${index}`).className == "letter_correct" ) {
                    unplaced_chars.delete(index);
                    continue;
                }
            }
        }
    });

    if( unknown_chars.size > 0 ) {
        var hint_char = Array.from(unknown_chars)[Math.floor(Math.random() * unknown_chars.size) ];
        document.getElementById(`id_key_${hint_char}`).className = "key_letter_correct";
    } else {
        console.log(`hint index = ${hint_index}`);
        var hint_index = Array.from(unplaced_chars)[Math.floor(Math.random() * unplaced_chars.size) ];
        document.getElementById(`id_letter_${current_row}_${hint_index}`).innerText = check_array[hint_index];
    }
}

function binaryFindFr(arr, searchValue, start, end) {
    if (start > end)
        return false;
  
    let mid=Math.floor((start + end)/2);
    let compareValue = arr[mid].normalize('NFD').replace(/[\u0300-\u036f]/g, "").localeCompare(searchValue);
  
    if (compareValue == 0)
        return true;

    if( compareValue > 0)
        return binaryFindFr(arr, searchValue, start, mid-1);
    else
        return binaryFindFr(arr, searchValue, mid+1, end);
}

function binaryFindEn(arr, searchValue, start, end) {
    if (start > end)
        return false;
  
    let mid=Math.floor((start + end)/2);
  
    if (arr[mid]===searchValue)
        return true;
         
    if(arr[mid] > searchValue)
        return binaryFindEn(arr, searchValue, start, mid-1);
    else
        return binaryFindEn(arr, searchValue, mid+1, end);
}

function binaryFind(arr, searchValue) {
    if( document.querySelector('input[name="word_language"]:checked').value == "en")
        return binaryFindEn(arr, searchValue, 0, arr.length - 1);
    else
        return binaryFindFr(arr, searchValue, 0, arr.length - 1);
}

function submit() {
    if( current_letter == length_number && current_row < length_number + 1 ) {
        var fullWord = "";
        for( check_letter = 0; check_letter < length_number; check_letter++ ) {
            fullWord = fullWord + document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText;
        }
        var word_array;
        if( document.querySelector('input[name="word_language"]:checked').value == "en")
            word_array = getWordList(length_number);
        else
            word_array = getWordListFr(length_number);

        if( binaryFind(word_array, fullWord.toLowerCase())) {
            var check_array = random_word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split("");
            var correct_count = 0;
            var letter_correct_count = 0;

            if( document.getElementById("id_setting_multichar").checked ) {
                var guess_array = Array(length_number).fill(' ');
                var result_array = Array(length_number).fill('key_incorrect');
                for( check_letter = 0; check_letter < length_number; check_letter++ ) {
                    guess_array[check_letter] = document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText;
                    if( guess_array[check_letter] == check_array[check_letter]) {
                        result_array[check_letter] = 'position_correct';
                        check_array[check_letter] = '';
                        correct_count++;
                    }
                }
                for( check_letter = 0; check_letter < length_number; check_letter++ ) {
                    if( result_array[check_letter] == 'key_incorrect' ) {
                        var foundIndex = check_array.findIndex( letter => letter === guess_array[check_letter]);
                        if( foundIndex > -1 ) {
                            setTimeout( function(current_row, check_letter) {
                                document.getElementById(`id_row_${current_row}_${check_letter}`).className = "letter_correct";
                            }, 200 * letter_correct_count , current_row, check_letter );
                            check_array[foundIndex] = '';
                            if( document.getElementById(`id_key_${document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText}`).className == "" ) {
                                document.getElementById(`id_key_${document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText}`).className = "key_letter_correct";
                            }
                            letter_correct_count++;
                        } else {
                            if( document.getElementById(`id_key_${document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText}`).className == "" ) {
                                document.getElementById(`id_key_${document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText}`).className = "key_incorrect";
                            }
                        }
                    } else {
                        setTimeout( function(current_row, check_letter) {
                            document.getElementById(`id_row_${current_row}_${check_letter}`).className = "position_correct";
                        }, 200 * letter_correct_count , current_row, check_letter );
                        document.getElementById(`id_key_${document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText}`).className = "key_position_correct";
                        letter_correct_count++;
                    }
                }
            } else {
                for( check_letter = 0; check_letter < length_number; check_letter++ ) {
                    if( document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText == check_array[check_letter] ) {
                        setTimeout( function(current_row, check_letter) {
                            console.log(`id_row_${current_row}_${check_letter} position_correct`)
                            document.getElementById(`id_row_${current_row}_${check_letter}`).className = "position_correct";
                        }, 200 * (letter_correct_count + correct_count), current_row, check_letter );
                        correct_count++;
                        document.getElementById(`id_key_${document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText}`).className = "key_position_correct";
                    } else if( random_word.includes( document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText )) {
                        setTimeout( function(current_row, check_letter) {
                            document.getElementById(`id_row_${current_row}_${check_letter}`).className = "letter_correct";
                        }, 200 * (letter_correct_count + correct_count), current_row, check_letter );
                        letter_correct_count++;
                        if( document.getElementById(`id_key_${document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText}`).className == "" ) {
                            document.getElementById(`id_key_${document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText}`).className = "key_letter_correct";
                        }
                    } else {
                        document.getElementById(`id_key_${document.getElementById(`id_letter_${current_row}_${check_letter}`).innerText}`).className = "key_incorrect";
                    }
                }
            }

            if( correct_count == length_number ) {
                check_array = random_word.split("");
                for( change_class = 0; change_class < length_number; change_class++) {
                    document.getElementById(`id_letter_${current_row}_${change_class}`).innerText = check_array[change_class];
                }

                setTimeout( function(length_number, current_row) {
                    displayStats( 
                        incrementStat(length_number, 'success', current_row )
                    );
                }, 200 * length_number, length_number, current_row );

                for( chaning = current_row ; chaning < length_number ; chaning++ ) {
                    current_row++;

                    for( change_class = 0; change_class < length_number; change_class++) {
                        document.getElementById(`id_row_${current_row}_${change_class}`).className = "current_row";
                    }
                }
                current_row++;
                document.getElementById("id_definition").style = `width: 100%; visibility: visible; display: flex;`;

            } else {
                current_row++;
                if( current_row < length_number + 1) {
                    current_letter = 0;

                    for( change_class = 0; change_class < length_number; change_class++) {
                        document.getElementById(`id_row_${current_row}_${change_class}`).className = "current_row";
                    }
                } else {
                    check_array = random_word.split("");
                    for( change_class = 0; change_class < length_number; change_class++) {
                        setTimeout( function(current_row, change_class, letter) {
                            document.getElementById(`id_row_${current_row}_${change_class}`).className = "whomp";
                            document.getElementById(`id_letter_${current_row}_${change_class}`).innerText = letter;
                        }, 200 * (letter_correct_count + correct_count + change_class + 1), current_row-1, change_class, check_array[change_class] );
                        
                        //document.getElementById(`id_row_${current_row-1}_${change_class}`).className = "whomp";
                        document.getElementById("id_definition").style = `width: 100%; visibility: visible; display: flex;`;
                    }
                    current_row = length_number + 1;
                    setTimeout( function() {
                        displayStats( 
                            incrementStat(length_number, 'whomp' )
                        );
                    }, 200 * (letter_correct_count + correct_count + change_class));
                }
            }
        } else {
            incrementStat(length_number, 'wildGuess' );
            alert("What the heck word is that?");
        }
    }
}

function incrementStat( length_number , operation , guesses = 0 ) {
    var stats = window.localStorage.getItem( "stats" + length_number );
    if( !stats ) {
        stats = initializeStat( length_number );
    } else {
        stats = JSON.parse(stats);
    }
    stats[operation][guesses]++;
    window.localStorage.setItem( "stats" + length_number , JSON.stringify(stats) );

    return stats;
}

function initializeStat( length_number ) {
    var stats = {
        wildGuess: [0],
        whomp: [0],
        success: Array(length_number + 1).fill(0)
    };
    window.localStorage.setItem( "stats" + length_number , JSON.stringify(stats) );

    return stats;
}

function getStat( length_number ) {
    var stats = window.localStorage.getItem( "stats" + length_number );
    if( !stats ) {
        stats = initializeStat( length_number );
    } else {
        stats = JSON.parse(stats);
    }
    return stats;
}

function displayStats( stats ) {
    var totalGuesses = 0;
    stats.success.forEach( (runningCount) => {
        totalGuesses += runningCount;
    });
    var innerHTML = `<label style="width: 100%; font-size: 16pt; text-align: center; grid-column: 1 / 3;">Games won: ${totalGuesses}</label>`;
    innerHTML += `<label style="width: 100%; font-size: 16pt; text-align: center; grid-column: 1 / 3;">Games lost: ${stats.whomp[0]}</label>`;
    if( totalGuesses > 0 ) {
        stats.success.forEach( (runningCount, index) => {
            innerHTML += `<label style="width: 100%; font-size: 16pt; text-align: center;">${index+1}</label><div style="width: ${Math.ceil((runningCount / totalGuesses) * 100)}%; background-color: blue;"></div>`
        });
    }
    document.getElementById("id_stats_graph").innerHTML = innerHTML;
    
    document.getElementById("id_stats").style.transform = "translate(-50%, 10px )";
    document.getElementById("id_settings").style.transform = "translate( -50%, -150%)";
    document.getElementById("id_game_grid").style.transform = "translate( 0%, -150% )";
}

function displayGame() {
    document.getElementById("id_stats").style.transform = "translate( -50%, -150%)";
    document.getElementById("id_settings").style.transform = "translate( -50%, -150%)";
    document.getElementById("id_game_grid").style.transform = "translate( 0% , 0% )";
}

function displaySettings() {
    document.getElementById("id_stats").style.transform = "translate( -50%, -150%)";
    document.getElementById("id_settings").style.transform = "translate( -50%, 10px)";
    document.getElementById("id_game_grid").style.transform = "translate( 0% , -150% )";
}

function initializeSettings( ) {
    var settings = {
        language: "en",
        char_uniqueness: false,
        hints: false
    };
    window.localStorage.setItem( "userprefs" , JSON.stringify(settings) );

    return settings;
}

function getSettings( ) {
    var settings = window.localStorage.getItem( "userprefs" );
    if( !settings ) {
        settings = initializeSettings( );
    } else {
        settings = JSON.parse(settings);
    }
    return settings;
}

function loadSettings() {
    var settings = getSettings();
    document.getElementById("id_setting_multichar").checked = settings.char_uniqueness;
    document.getElementById("id_setting_hints").checked = settings.hints;
    if( settings.language ) {
        document.querySelector(`input[name="word_language"][value="${settings.language}"]`).checked = true;
    }
}

function saveSettings() {
    var settings = getSettings();
    settings.char_uniqueness = document.getElementById("id_setting_multichar").checked;
    settings.hints = document.getElementById("id_setting_hints").checked;
    settings.language = document.querySelector('input[name="word_language"]:checked').value;

    window.localStorage.setItem( "userprefs" , JSON.stringify(settings) );
}

function backLetter() {
    if( current_letter > 0 && current_row < length_number + 1 ) {
        current_letter--;
        document.getElementById(`id_letter_${current_row}_${current_letter}`).innerText = "";
    }
}

document.addEventListener('keyup', (event) => {
    const keyName = event.key;
  
    if (keyName === 'Backspace') {
        backLetter();
    } else if (keyName === 'Enter') {
        submit();
    } else if (keyName >= 'a' && keyName <='z' ) {
        enterLetter(keyName.toUpperCase());
    } else if (keyName >= 'a' && keyName <='z' ) {
        enterLetter(keyName);
    }
}, false);

document.addEventListener( 'DOMContentLoaded', (e) => {
    loadSettings();
    getRandomWord("5", document.querySelector('input[name="word_language"]:checked').value);
});
