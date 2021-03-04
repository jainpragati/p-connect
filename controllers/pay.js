const checksum_lib = require('../Paytm-node/checksum/checksum');
const port = 5000;
module.exports = (app) => {
  app.get('/payment', (req, res) => {
    let params = {};
    params['MID'] = 'FTjaSo70095537113505';
    params['WEBSITE'] = 'WEBSTAGING';
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = 'ORD0001';
    params['CUST_ID'] = 'CUST0011';
    params['TXN_AMOUNT'] = '100';
    params['CALLBACK_URL'] = '/success';
    params['EMAIL'] = 'prajapatchinmay@gmail.com';
    params['MOBILR_NO'] = '8197453533';

    checksum_lib.genchecksum(params, 'Vq#13pceyXVWAjGj', function (
      err,
      checksum
    ) {
      let txn_url = 'https://securegw-stage.paytm.in/order/process';
      let form_field = '';
      for (x in params) {
        form_field +=
          "<input type='hidden' name='" + x + "' value='" + params[x] + "'>";
      }
      form_field +=
        "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "'/>";
      var html =
        '<html><body><center><h1>Please wait! Do not refresh the page</h1></center><form method="post" action="' +
        txn_url +
        '" name="f1">' +
        form_fields +
        '</form><script type="text/javascript">document.f1.submit()</script></body></html>';
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(html);
      res.end();
    });
  });
};
