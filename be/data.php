<?php
/* Connect DB */
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Methods: GET, POST");
// header("Content-Type: application/json; charset=utf-8");
/* Handle CORS */

// Specify domains from which requests are allowed
header('Access-Control-Allow-Origin: *');

// Specify which request methods are allowed
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');

// Additional headers which may be sent along with the CORS request
header('Access-Control-Allow-Headers: X-Requested-With,Authorization,Content-Type');

// Set the age to 1 day to improve speed/caching.
header('Access-Control-Max-Age: 86400');

// Exit early so the page isn't fully loaded for options requests
if (strtolower($_SERVER['REQUEST_METHOD']) == 'options') {
    exit();
}

require 'config.php';

set_time_limit(0);

$url = "https://financialmodelingprep.com/api/v3/";
$urlv4 = "https://financialmodelingprep.com/api/v4/";
$privateUrl = "https://financialmodelingprep.com/api/v4/priv/vik/";
$ourKey = "b28705c255684013d1bceab79ce90d0e";

$channel = curl_init();

if($_GET['q'] == 'company_outlook') {
  $privateUrl = $privateUrl."company-outlook?symbol=".$_GET['symbol']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $privateUrl);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'profile'){
  $url = $url.$_GET['q']."/".$_GET['symbol']."?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'search'){
  $url = $url.$_GET['q']."?query=".$_GET['query']."&limit=".$_GET['limit']."&exchange=ASX"."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'full_search'){
  $url = $url."search?query=".$_GET['query']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'stock'){
  $url = $url.$_GET['key']."?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'stock_news'){
  $url = $url.$_GET['q']."?limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'quotes'){
  $url = $url."quotes/index?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'stocks_historical_price_full'){
  $url = $url."historical-price-full/".$_GET['stocks']."?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'ratios_ttm'){
  $url = $url."ratios-ttm/".$_GET['symbol']."?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'quote'){
  $url = $url.$_GET['q']."/".$_GET['symbol']."?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'enterprise_values'){
  $url = $url."enterprise-values/".$_GET['symbol']."?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'sector_pe'){
  $url = $urlv4."sector_price_earning_ratio?date=".$_GET['date']."&exchange=".$_GET['exchange']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'income_statement'){
  $url = $url."income-statement/".$_GET['symbol']."?limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'ratios'){
  $url = $url."ratios/".$_GET['symbol']."?limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'ratios_limit_3'){
  $url = $url."ratios/".$_GET['symbol']."?limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'key_metrics'){
  $url = $url."key-metrics/".$_GET['symbol']."?limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'custom_stock_screener'){
  $url = $url."stock-screener/?apikey=".$ourKey.$_GET['options'];
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'historical_price_full'){
  $url = $url."historical-price-full/".$_GET['symbol']."?from=".$_GET['from']."&to=".$_GET['to']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'historical_price_full_bulk'){
  $url = $url."historical-price-full/".$_GET['symbol']."?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'income_statement_growth'){
  $url = $url."income-statement-growth/".$_GET['symbol']."?period=".$_GET['period']."&limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'cash_flow_statement_growth'){
  $url = $url."cash-flow-statement-growth/".$_GET['symbol']."?period=".$_GET['period']."&limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'stock_screener'){
  $url = $url."stock-screener?sector=".$_GET['sector']."&exchange=".$_GET['exchange']."&limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'balance_sheet_statement'){
  $url = $url."balance-sheet-statement/".$_GET['symbol']."?limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'cash_flow_statement'){
  $url = $url."cash-flow-statement/".$_GET['symbol']."?limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'stock_news_ticker'){
  $url = $url."stock_news/?tickers=".$_GET['tickers']."&limit=".$_GET['limit']."&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'rating'){
  $url = $url."rating/".$_GET['symbol']."?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'add_user'){
  // Get the posted data.
  $postdata = json_decode(file_get_contents("php://input"));
  $email = $postdata->email;
  $name = $postdata->name;
  $pwd = $postdata->pwd;
  $mobile = $postdata->mobile;
  $sql = "INSERT INTO users (`id`, `email`, `usertype`, `name`, `pwd`, `mobile`, `createdon`, `verifieduser`, `premiumuser`)
    VALUES ('', '".$email."', 'customer', '".$name."', '".$pwd."', '".$mobile."', CURRENT_TIMESTAMP, 1, 0)";
  $output = null;
  $output = $conn->query($sql);

  // $linkHere = 'http://morningbrisbane.com/be/data.php?q=verify&value='.$email.'&state=success';
  // $msg = "Hi ".$name.",\n\nWelcome to Money Corner Technologies, Please verify the email :\n".$linkHere."\n\nYours,\nMoney Corner Technologies Team";
  // if(mail($email,"Hi ".$name.", Money Corner Technologies - Verify email",$msg)) {
  //   echo 1;
  // } else {
  //   echo null;
  // }
  echo $output;
}

// if($_GET['q'] == 'verify'){
//   $value = $_GET['value'];
//   $sql = "UPDATE users SET `verifieduser`=1 WHERE `email`='".$value."'";
//   $output = null;
//   $output = $conn->query($sql);
//   echo 'Successfully verified, Please wait...';
//   header("Location:http://morningbrisbane.com/#/account");
//   exit();
// }

if($_GET['q'] == 'contact_user'){
  // Get the posted data.
  $postdata = json_decode(file_get_contents("php://input"));
  $email = $postdata->email;
  $name = $postdata->name;
  $phno = $postdata->phno;
  $msg = $postdata->msg;

  $textHere = "Name: ".$name.",<br>Email: ".$email.",<br>PhoneNo: ".$phno.",<br>Message: ".$msg;
  $msg = "Hello Team, Mr/Ms ".$name.", Contacted to Findurstocks.com, <br><br>".$textHere;
  // if(mail("moneycornertechnologies@gmail.com", "Message from Findurstocks.com", $msg)) {
  //   echo 1;
  // } else {
  //   echo null;
  // }


  require("class.phpmailer.php");

  $mail = new PHPMailer();
  
  $mail->IsSMTP();
  $mail->Host = "morningbrisbane.com";
  
  $mail->SMTPAuth = true;
  //$mail->SMTPSecure = "ssl";
  $mail->Port = 587;
  $mail->Username = "support@morningbrisbane.com";
  $mail->Password = "59$2ghaB";
  
  $mail->From = "support@morningbrisbane.com";
  $mail->FromName = "FindUrStocks";
  $mail->AddAddress("moneycornertechnologies@gmail.com");
  //$mail->AddReplyTo("mail@mail.com");
  
  $mail->IsHTML(true);
  
  $mail->Subject = "Message from Findurstocks.com";
  $mail->Body = $msg;
  //$mail->AltBody = "This is the body in plain text for non-HTML mail clients";
  
  if(!$mail->Send())
  {
    echo null;
    exit;
  } else {
    echo 1;
  }
}

if($_GET['q'] == 'login'){

  // Get the posted data.
  $postdata = json_decode(file_get_contents("php://input"));
  $email = $postdata->email;
  $pwd = $postdata->pwd;
  if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $sql = "SELECT * FROM users WHERE `email`='".$email."' AND `pwd`='".$pwd."'";
  }
  $result = $conn->query($sql);
  $output = null;
  if ($result->num_rows > 0) {
    $output = $result->fetch_assoc();
    echo json_encode($output);
  } else {
    echo $output;
  }
}

if($_GET['q'] == 'get_portfolios'){
  if (filter_var($_GET['email'], FILTER_VALIDATE_EMAIL)) {
    $sql = "SELECT portfolio FROM users WHERE `email`='".$_GET['email']."' LIMIT 1";
  }
  $result = $conn->query($sql);
  $output = null;
  if ($result->num_rows > 0) {
    $output = $result->fetch_assoc();
    echo json_encode($output);
  } else {
    echo $output;
  }
}

if($_GET['q'] == 'update_portfolios'){
  // Get the posted data.
  $postdata = json_decode(file_get_contents("php://input"));
  $email = $postdata->email;
  $data = $postdata->data;
  $sql = "UPDATE users SET `portfolio`='".$data."' WHERE `email`='".$email."'";
  $output = null;
  $output = $conn->query($sql);
  echo $output;
}

if($_GET['q'] == 'financial_growth'){
  $url = $url."financial-growth/".$_GET['symbol']."?limit=1&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'sec_filings'){
  $url = $url."sec_filings/".$_GET['symbol']."?limit=4&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'press_releases'){
  $url = $url."press-releases/".$_GET['symbol']."?limit=4&apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

if($_GET['q'] == 'stock_list'){
  $url = $url."stock/list?apikey=".$ourKey;
  curl_setopt($channel, CURLOPT_AUTOREFERER, TRUE);
  curl_setopt($channel, CURLOPT_HEADER, 0);
  curl_setopt($channel, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($channel, CURLOPT_URL, $url);
  curl_setopt($channel, CURLOPT_FOLLOWLOCATION, TRUE);
  curl_setopt($channel, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($channel, CURLOPT_TIMEOUT, 0);
  curl_setopt($channel, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($channel, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($channel, CURLOPT_SSL_VERIFYPEER, FALSE);
  $output = curl_exec($channel);
  if (curl_error($channel)) {
      return 'error:' . curl_error($channel);
  } else {
    echo json_encode($output);
  }
}

?>