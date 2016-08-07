var App = (function() {
    'use strict';

    var Actions = {

        actions: [],
        currentPoints: 0,

        appendHtml: function(el, str) {
            var div = document.createElement('div');
            div.innerHTML = str;
            while (div.children.length > 0) {
                el.appendChild(div.children[0]);
            }
        },

        formatTime: function(total) {

            Number.prototype.pad = function(size) {
                var s = String(this);
                while (s.length < (size || 2)) {s = "0" + s;}
                return s;
            };

            var minute = Math.floor(total/60);
            var seconds = total - (minute*60);

            return minute.pad() + ':' + seconds.pad();
        },

        setTime: function(actionElement, time) {
            var timeElement = actionElement.getElementsByClassName('js-action-time');
            timeElement[0].innerHTML = this.formatTime(time);
        },

        showAction: function(action) {
            var template = [
                '<div id="js-action-{id}" title="{title}" class="js-action-click action action--{id}" data-id="{id}" onclick="App.actionClick(this)">',
                    '<div class="action__image"></div>',
                    '<div class="js-action-time action__time"></div>',
                '</div>'
            ].join('');

            template = template.replace(/{[^{}]+}/g, function(key) {
                return action[key.replace(/[{}]+/g, "")] || "";
            });

            this.appendHtml(document.getElementById('js-actions'), template);
        },

        getActionById: function(actionId) {

            for (var i = 0; i < Actions.actions.length; i++) {
                if (Actions.actions[i].id == actionId) {
                    return Actions.actions[i];
                }
            }
            return false;
        },

        updatePoints: function(points) {
            Actions.currentPoints = points;
            var pointElement = document.getElementById('js-current-points');
            pointElement.innerHTML = points;
        },

        actionClick: function(actionElement) {

            var actionId = actionElement.getAttribute('data-id');
            var action = Actions.getActionById(actionId);

            if (action.active === true) {
                Actions.makeAction(actionElement, action);
            }
        },

        makeAction: function(actionElement, action) {

            var points = Actions.currentPoints + action.points;
            Api.call('POST','api/index.php', 'actionId='+action.id, function() {
                Actions.updatePoints(points);
                Actions.disableAction(actionElement, action);
            });
        },

        disableAction: function(actionElement, action) {
            action.active = false;
            Class.addClass(actionElement, 'action--inactive');
            Actions.setTime(actionElement, action.recovery_time);

            var timeLeft = action.recovery_time;

            var timeout = setInterval(function () {
                if (timeLeft > 1) {
                    timeLeft--;
                    Actions.setTime(actionElement, timeLeft);
                } else {
                    Actions.enableAction(actionElement, action);
                    clearTimeout(timeout);
                }
            }, 1000);
        },

        enableAction: function(actionElement, action) {
            action.active = true;
            Class.removeClass(actionElement, 'action--inactive');
        },

        init: function() {
            Api.call('GET', 'api/index.php', {}, function(data) {
                if (data.status == 'ok' && data.current_points && data.actions) {
                    Actions.actions = data.actions;
                    Actions.updatePoints(data.current_points);

                    for (var i = 0; i < Actions.actions.length; i++) {
                        Actions.actions[i].active = true;
                        Actions.showAction(Actions.actions[i]);
                    }
                }
            });
        }
    };

    Actions.init();

    return {
        actionClick: Actions.actionClick
    }

})();