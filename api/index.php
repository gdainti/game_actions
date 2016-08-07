<?php

class Api {

    private $actions = array(

        0 => array(
            'id' => 145,
            'title' => 'Test 1',
            'rest_time' => 0,
            'recovery_time' => 5, // seconds
            'points' => 10,
        ),

        1 => array(
            'id' => 146,
            'title' => 'Test 2',
            'rest_time' => 428,
            'recovery_time' => 10,
            'points' => 20,
        ),

        2 => array(
            'id' => 147,
            'title' => 'Test 3',
            'rest_time' => 0,
            'recovery_time' => 480,
            'points' => 30,
        ),

        3 => array(
            'id' => 148,
            'title' => 'Test 4',
            'rest_time' => 0,
            'recovery_time' => 420,
            'points' => 40,
        ),
    );

    private $current_points = 123;

    private function getActions() {
        return $this->actions;
    }

    private function getPoints() {
        return $this->current_points;
    }

    private function setPoints($current_points) {
        $this->current_points = $current_points;
    }

    private function addPoints($addPoints) {
        $this->current_points += $addPoints;
    }

    public function request() {

        switch ($_SERVER['REQUEST_METHOD']) {

            case 'POST':

                // update current points

                echo json_encode(array(
                    'status' => 'ok',
                ));
                break;

            case 'GET':
                    echo json_encode(array(
                        'actions' => $this->getActions(),
                        'current_points' => $this->getPoints(),
                        'status' => 'ok',
                    ));
                break;

            case 'PUT':
                break;

            default:
                echo json_encode(array('status' => 'notok'));
                break;
        }
    }
}

header('Content-Type: application/json');
$Api = new Api();
$Api->request();


