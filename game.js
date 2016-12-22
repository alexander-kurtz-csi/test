/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {

    $('.fn_dice_role').on('click', function () {
        dice.role();
        game.lastDicedNumber = dice.getNumber();

        game.doPlayersMove();
    });
    $('.fn_game_start').on('click', function () {
        game.start();
    });

    game.init();

});

var game = {
    stepSpeed: 500,
    players: 0,
    actual_player: 0,
    actual_PlayerFigureNumber: 0,
    lastDicedNumber: 0,
    init: function () {
        board.init();
        $('#dice').hide();
        $('#player_info').hide();
    },
    start: function () {

        if ($('#players').val() > 0) {        
            dice.enable();
            $('#select_players').hide();
            $('#dice').show();
            $('#player_info').show();

            this.setPlayers();
            this.initPlayerFigures();
            this.actual_player = 1;
            this.showActualPlayerNumber();

            // Ersten spieler TESTWEISE aus Start setzen...

            /*for (i_player=1; i_player === this.players; i_player++) {
                pos = board.field_positions_startend[i_player].start;
                game.setFigureToField(i_player,0,pos,'');    
            }*
          
          /*  board.field_positions_startend */

            //game.setFigureToField(1, 0, 0, '');
            //game.setFigureToField(2, 0, 10, '');
            //game.setFigureToField(3, 0, 20, '');
            //game.setFigureToField(4, 0, 30, '');

           // */

        }
    },
    setPlayers: function () {
        this.players = $('#players').val();
    },
    showActualPlayerNumber: function () {
        $('#actual_player_number').text(this.actual_player).attr('class', 'for-player-' + this.actual_player);
    },
    /**
     * @todo: das ganze noch mal umbauen, so das erst gewürfeklt wirdn, und dann 
     * die figur die bewegt werden soll ausgewählt werden muss...
     */

    doPlayersMove: function () {
        dice.disable();
        console.log(this.actual_player, this.actual_PlayerFigureNumber, this.lastDicedNumber);

        var _this = this;
        figuresInBase = this.howManyFiguresInBase(this.actual_player);
        console.log("figuresInBase",figuresInBase);

        // Noch ALLE Figuen in der Base?
        if (figuresInBase === 4) {

            // Wurde eine 6 gewürfelt?
            if (_this.lastDicedNumber === 6) {

                $('.figure.for-player-' + this.actual_player + '.at_base').addClass('can-click').on('click', function () {

                    $('.figure').removeClass('can-click').off('click');

                    info = this.id.split('_'); // pf_<fig>_<player>
                    console.log(info,'Need to set figure from base to start');
                    _this.actual_PlayerFigureNumber = info[1];
                     // this.MoveFromBaseToStart();
                });

            } else {
                dice.enable();
            }


        } else {

            $('.figure.for-player-' + this.actual_player).addClass('can-click').on('click', function () {

                $('.figure').removeClass('can-click').off('click');

                info = this.id.split('_'); // pf_<fig>_<player>
                console.log(info);
                _this.actual_PlayerFigureNumber = info[1];
                _this.moveFigure(_this.actual_player, _this.actual_PlayerFigureNumber, _this.lastDicedNumber);
            });
        }





//        this.moveFigure(this.actual_player, this.actual_PlayerFigureNumber, this.lastDicedNumber);
    },
    setNextPlayer: function () {
        if (this.lastDicedNumber < 6) {
            this.actual_player++;
            this.actual_player > this.players ? this.actual_player = 1 : null;
        }
        this.showActualPlayerNumber();
        dice.enable();
    },
    //--------
    howManyFiguresInBase: function(player_number) {
        return $('.figure.for-player-'+player_number).length;

    },

    initPlayerFigures: function () {
        for (p = 0; p < this.players; p++) {

            for (f = 0; f <= 4; f++) {
                figure = '<div id="pf_' + f + '_' + (p + 1) + '" class="figure for-player-' + (p + 1) + ' ">' + String.fromCharCode(97 + f) + '</div>';
                base_selector = 'f_b_' + (p + 1) + '_' + (f);
               // $(figure).addClass('at_base');
                $('#' + base_selector).append(figure);

                this.toggleFigureClass(p,f,'at_base');
            }
        }
    },
    moveFigure: function (player_number, figure_number, steps) {
        // Herausfinden WO (auf welchem Feld) die Figur steht
        figure_id = 'pf_' + figure_number + '_' + (player_number);
        act_field = $('#' + figure_id).parent();

        // Infos zum aktuellem Feld ermitteln
        field_infos = $(act_field).attr('id').split('_');

//        new_field_number = (field_infos[1]*1) + steps;
//        
//        if (new_field_number >= 39) {
//            new_field_number = new_field_number-39;
//        }
//        
//        console.log('new_field_number',new_field_number);
//        console.log('end',board.field_positions_startend[player_number-1].end);
//
//        
//        if(new_field_number <> board.field_positions_startend[player_number-1].end) {
//            this.setFigureToField(player_number, figure_number, new_field_number, '');            
//        } else {
//            // Figur würde in Haus gehen
//        }


        /** @todo: es muss ermitteln werden, ob dieser zug möglich ist, d.h. 
         *       Wenn der Zug in das Haus gehen würde, ob die figur das haus
         *        nicht wider verlassen würde, oder ob er nicht auf  bereits belegten
         *        Positionen landen würde, ... (ob die regeln für das betreten des hauses
         *        nicht gebrochen werden würden....)
         */

//        console.log(field_infos);

        this.moveFigureOneStep(player_number, figure_number, (field_infos[1] * 1), steps)

    },
    moveFigureOneStep: function (player_number, figure_number, act_field_number, stepsToGo) {
        // Nächstes Feld ermitteln
        var new_field_number = act_field_number + 1;
        if (new_field_number > 39) {
            new_field_number = new_field_number - 40;
        }

        // Figur auf nächstes Feld setzten
        if (new_field_number !== board.field_positions_startend[player_number - 1].end) {
            this.setFigureToField(player_number, figure_number, new_field_number, '');
        } else {
            // Figur würde in Haus gehen
        }

        var _player_number = player_number;
        var _figure_number = figure_number;
        var _stepsToGo = stepsToGo - 1;
        var _this = this;

        if (_stepsToGo > 0) {
            setTimeout(function () {
                _this.moveFigureOneStep(_player_number, _figure_number, new_field_number, _stepsToGo);
            }, this.stepSpeed);
        } else {
            this.setNextPlayer();
        }
    }, setFigureToField: function (player_number, figure_number, field_number, type) {
        figure_id = 'pf_' + figure_number + '_' + (player_number);
        figure = '<div id="' + figure_id + '" class="figure for-player-' + (player_number) + '"></div>';

        // Firgur von alter Position entfernen
        $('#' + figure_id).remove();

        // Figur an neue Position setzten
        if (type.length > 0) {
            field_selector = 'f_' + type + '_' + (player_number) + '_' + (figure_number);
        } else {
            field_selector = 'f_' + field_number;
        }
        $('#' + field_selector).append(figure);
    },

    toggleFigureClass: function(player_number, figure_number, class_name){
        figure_id = '#pf_' + (figure_number) + '_' + (player_number+1);
       // console.log('toggleFigureClass',figure_id,class_name,$(figure_id));
        if ($(figure_id).hasClass(class_name)) {
            $(figure_id).removeClass(class_name);
        } else {
            $(figure_id).addClass(class_name);
        }
    },
};

var board = {
    player_firgures_positions: null,
    field_positions: [
        {r: 0, c: 6},
        {r: 1, c: 6},
        {r: 2, c: 6},
        {r: 3, c: 6},
        {r: 4, c: 6},
        {r: 4, c: 7},
        {r: 4, c: 8},
        {r: 4, c: 9},
        {r: 4, c: 10},
        {r: 5, c: 10},
        {r: 6, c: 10},
        {r: 6, c: 9},
        {r: 6, c: 8},
        {r: 6, c: 7},
        {r: 6, c: 6},
        {r: 7, c: 6},
        {r: 8, c: 6},
        {r: 9, c: 6},
        {r: 10, c: 6},
        {r: 10, c: 5},
        {r: 10, c: 4},
        {r: 9, c: 4},
        {r: 8, c: 4},
        {r: 7, c: 4},
        {r: 6, c: 4},
        {r: 6, c: 3},
        {r: 6, c: 2},
        {r: 6, c: 1},
        {r: 6, c: 0},
        {r: 5, c: 0},
        {r: 4, c: 0},
        {r: 4, c: 1},
        {r: 4, c: 2},
        {r: 4, c: 3},
        {r: 4, c: 4},
        {r: 3, c: 4},
        {r: 2, c: 4},
        {r: 1, c: 4},
        {r: 0, c: 4},
        {r: 0, c: 5}
    ],
    field_positions_home: [
//        player_1: 
        [
            {r: 1, c: 5},
            {r: 2, c: 5},
            {r: 3, c: 5},
            {r: 4, c: 5}
        ],
//        player_2: 
        [
            {r: 5, c: 9},
            {r: 5, c: 8},
            {r: 5, c: 7},
            {r: 5, c: 6}
        ],
//        player_3:
        [
            {r: 9, c: 5},
            {r: 8, c: 5},
            {r: 7, c: 5},
            {r: 6, c: 5}
        ],
//        player_4:
        [
            {r: 5, c: 1},
            {r: 5, c: 2},
            {r: 5, c: 3},
            {r: 5, c: 4}
        ],
    ],
    field_positions_startend: [
//        player_1: 
        {start: 0, end: 39},
//        player_2: 
        {start: 10, end: 9},
//        player_3:
        {start: 20, end: 19},
//        player_4:
        {start: 30, end: 29},
    ],
    field_positions_base: [
//        player_1: 
        [
            {r: 0, c: 8},
            {r: 0, c: 10},
            {r: 2, c: 8},
            {r: 2, c: 10}
        ],
//        player_2: 
        [
            {r: 8, c: 8},
            {r: 8, c: 10},
            {r: 10, c: 8},
            {r: 10, c: 10}
        ],
//        player_3:
        [
            {r: 8, c: 0},
            {r: 8, c: 2},
            {r: 10, c: 0},
            {r: 10, c: 2}
        ],
//        player_4:
        [
            {r: 0, c: 0},
            {r: 0, c: 2},
            {r: 2, c: 0},
            {r: 2, c: 2}
        ],
    ],
    init: function () {
        this.build_maingrid();
        this.add_fields();
    },
    build_maingrid: function () {
        $maingrid = $('.maingrid');
        for (r = 0; r < 11; r++) {
            for (c = 0; c < 11; c++) {
                $maingrid.append('<div class="grid-item gir-' + r + ' gic-' + c + '"></div>');
            }
            $maingrid.append('<div style="clear: both;">');
        }
    },
    add_fields: function () {
        count = this.field_positions.length;
        for (i = 0; i < count; i++) {
            pos = this.field_positions[i];
            s = '.grid-item.gir-' + pos.r + '.gic-' + pos.c;
            $(s).append('<div class="field" id="f_' + i + '">' + i + '</div>');
        }

        for (p = 0; p < 4; p++) {
            homefields = this.field_positions_home[p];
            for (i = 0; i < 4; i++) {
                pos = homefields[i];
                s = '.grid-item.gir-' + pos.r + '.gic-' + pos.c;
                $(s).append('<div class="field field-home for-player-' + (p + 1) + '" id="f_h_' + (p + 1) + '_' + i + '">' + String.fromCharCode(65 + i) + '</div>');
            }

            basefields = this.field_positions_base[p];
            for (i = 0; i < 4; i++) {
                pos = basefields[i];
                s = '.grid-item.gir-' + pos.r + '.gic-' + pos.c;
                $(s).append('<div class="field field-base for-player-' + (p + 1) + '" id="f_b_' + (p + 1) + '_' + i + '">' + String.fromCharCode(65 + i) + '</div>');
            }

            startend = this.field_positions_startend[p];
            console.log(p, startend);
            $('#f_' + startend.start).addClass('field-start').addClass('for-player-' + (p + 1)).text('S');
            $('#f_' + startend.end).addClass('field-end').addClass('for-player-' + (p + 1));

        }
    }
};
var player = {};

var dice = {
    _number: 0,
    role: function () {
        rounds = Math.floor((Math.random() * 25) + 20);
        for (i = 0; i < rounds; i++) {
            this._number = Math.floor((Math.random() * 6) + 1);
            this.show();
        }
    },
    getNumber: function () {
        return this._number;
    },
    show: function () {
        $('#dice_number').text(this.getNumber());
       // $('#dice img').attr('src', 'http://dobbelsteen.virtuworld.net/img/' + this.getNumber() + 'c.gif');
    },
    disable: function () {
        $('.fn_dice_role').prop('disabled', true);
    },
    enable: function () {
        $('.fn_dice_role').prop('disabled', false);
    },
};
