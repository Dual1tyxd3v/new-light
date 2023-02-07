<?
if (!$_POST['phone']) {
  echo "error";
}
//В переменную $token нужно вставить токен
$token = "5910914438:AAGnFKdoICio2rw007B1IItl7ovDFSpOpcs";

//Сюда вставляем chat_id
$chat_id = "-1001660934627";

//Определяем переменные для передачи данных из нашей формы
if ($_POST['phone']) {
    $phone = '%2b';
    $phone .= ($_POST['phone']);
    $name = ($_POST['name']);
    $email = ($_POST['email']);

//Собираем в массив то, что будет передаваться боту
    $arr = array(
        'Имя:' => $name ? $name : '___',
        'Телефон:' => $phone,
        'E-mail:' => $email ? $email : '___'
    );

//Настраиваем внешний вид сообщения в телеграме
    foreach($arr as $key => $value) {
        $txt .= "".$key." ".$value."%0A";
    };
    $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

//Выводим сообщение об успешной отправке
    if ($sendToTelegram) {
        echo "1";
    }

//А здесь сообщение об ошибке при отправке
    else {
      echo "0";
    }
}

?>
