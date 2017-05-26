(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

    function MainCtrl($scope, $localStorage, socket, lodash) {

        $scope.message = '';
        $scope.all_messages = [];
        $scope.users = [];

        $scope.username = $localStorage.login_name;
        let name = $scope.username;


        socket.emit('get-users');

        //Get all users and check it with current user.
        socket.on('all-users', function(data) {
            console.log(data);
            $scope.users = data.filter(function(item) {
                return item.nickname !== name;
            });
        });


        //Push new message to messages array to display on ther user's screen.
        socket.on('message-received', function(data) {
            $scope.all_messages.push(data);
        });

        //Write message to sokcet with key, value pair of user and message.
        $scope.send = function(data) {
            let newMessage = {
                message: $scope.message,
                from: $scope.username
            };
            socket.emit('send-message', newMessage);
            $scope.message = '';

        };

        //------------------------------------White borad-----------------------------------------------------//



        //Initializing required parametres.
        var
          socket = io(),
          canvas = document.getElementsByClassName('whiteboard')[0],
          colors = document.getElementsByClassName('color'),
          context = canvas.getContext('2d');


        //Restore canvas to blank.
        $scope.restoreCanvas = function() {

            context.clearRect(0, 0, canvas.width, canvas.height)

        }





        let current = {
            color: 'black'
        };
        let drawing = false;

        /*

              Mouse Events Function

        */

        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

        /*

              Socket connection ON For drawing

        */

        socket.on('drawing', onDrawingEvent);

        window.addEventListener('resize', onResize, false);
        onResize();


        function drawLine(x0, y0, x1, y1, color, emit) {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.stroke();
            context.closePath();

            if (!emit) {
                return; }
            let w = canvas.width;
            let h = canvas.height;

            /*

        Write the data in Socket server using "emit" method

  */

            socket.emit('drawing', {
                x0: x0 / w,
                y0: y0 / h,
                x1: x1 / w,
                y1: y1 / h,
                color: color
            });
        }


         /*

               base four mouse events.

         */

        function onResize() {
            canvas.width = 300;
            canvas.height = 300;
        }

        function onMouseDown(e) {
            drawing = true;
            current.x = e.clientX;
            current.y = e.clientY;
        }

        function onMouseUp(e) {
            if (!drawing) {
                return; }
            drawing = false;
            drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
        }

        function onMouseMove(e) {
            if (!drawing) {
                return; }
            drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
            current.x = e.clientX;
            current.y = e.clientY;
        }



        /*

              -limit the number of events per second.
              -This method basically keep tracks of time diffrence between two actions and if it's more then specified
              delay then only it's drew on board.
              -Objective of this method is to not flood socket with multiple actions at same time.

        */

        function throttle(callback, delay) {
            let previousCall = new Date().getTime();
            return function() {
                let time = new Date().getTime();

                if ((time - previousCall) >= delay) {//Time diffrence between two actions.
                    previousCall = time;
                    callback.apply(null, arguments);
                }
            };
        }


        /*

               Draw the data on canvas using Mouse coordinates.
               It takes four parametres, start points(x,y) end points(x,y) and color.

         */


        function onDrawingEvent(data) {
            let w = canvas.width;
            let h = canvas.height;
            drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
        }





    }

})();
