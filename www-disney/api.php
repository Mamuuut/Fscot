<?php
    require_once('server.php');
    require_once('jsonRPC2Server.php');
    $server = new server();
    $jsonRpc = new jsonRPCServer();
    $jsonRpc->registerClass($server);
    $jsonRpc->handle() or die('no request');
?>