// ==UserScript==
// @name         sudoku.name solver
// @namespace    http://github.com/mice2100
// @version      0.5
// @description  helper for http://www.sudoku.name
// @author       George Lou
// @match        http*://*.sudoku.name/index.php?*
// @icon         https://www.google.com/s2/favicons?domain=sudoku.name
// @grant        none
// @require      http://code.jquery.com/jquery-1.9.1.min.js
// @require      https://raw.githubusercontent.com/mice2100/sudoku.js/master/sudoku.js
// ==/UserScript==

function find_empty() {
    for (let i=1; i<83; i++) {
        if (! $(`#c${i}`).val() )
            return i;
    }
    return i;
}

function gen_board() {
    let board = '';
    for(let i=1; i<82; i++) {
        let v = $(`#c${i}`).val();
        if (!v) v = '.'
        board += v;
    }
    return board
}

function solve_game() {
    //limit_change(1);
    let st = Math.random()*900 + 180
    $('#hide_timer_count').val(st);
    startTime = st;
    timer_count  = st;
    let board = gen_board();
    let res = sudoku.solve(board);
    //sudoku.print_board(res);

    let intervalID = setInterval(function(){
        let cur = find_empty();
        if (cur>81) {
            //delete_marking(1);
            clearInterval(intervalID);
			setTimeout(()=>{unsafeWindow.check_grid()}, 100);
            return;
        }
        let elem = $(`#c${cur}`);
        elem.focus();
		// elem.click();

        elem.val(res[cur-1]);
        elem.change();

    }, 50);
}

function candidate() {
    let board = gen_board();
    console.log(board);
    let cndt = sudoku.get_candidates(board);
    let cur = 1;
    while(cur<82) {
        let pad = $(`#cpad${cur}`);
        let r = parseInt((cur-1)/9);
        let c = (cur-1)%9;
        if (!$(`#c${cur}`).val() ) {
            if (cndt[r][c].length==1) {
                $(`#c${cur}`).val(cndt[r][c]);
                $(`#c${cur}`).change();
            } else {
                pad.val(cndt[r][c]);
                pad.change();
            }
        } else if (pad) {
            pad.val('');
            pad.change();
        }
        //console.log(cur, r, c, cndt[r][c])
        cur++;
    }

}

(function() {
    //'use strict';

    // Your code here...
    $('#new_game_button').parent().append('<a id="solve_game" href="javascript:;">solve</a>');
    $('#new_game_button').parent().append('<br/>');
    $('#new_game_button').parent().append('<a id="candidate" href="javascript:;">mark</a>');

    $('#solve_game').click(solve_game);
    $('#candidate').click(candidate);

})();
