# Maryland Mortgage Program (MMP) Loan Calculator

This calculator is designed to help identify potentially eligible MMP loan products based on very basic criteria. 
- The estimated monthly payments are for principal and interest only.
- The calculator does not identify eligibility for mortgage credit certificates, which must be determined separately by a lender approved to offer the Maryland HomeCredit Program.

## Page Assets

To use this code, you must have the [`dist/index.css`](./dist/index.css) and [`dist/index.js`](./dist/index.js) hosted somewhere publicly accessible.

## Google Sheet

The products and county-based limits are sourced from a Google Sheet. In order to use this in with our calculator, you will need a Google Developer API key that has the Google Sheets API enabled.

In the example below, we will be using my API key and the Google Sheet that I created, which are both fine to reuse in production.

## Usage

To use, you will need to include the page assets as well as a target element that has the Google Sheet parameters included as data attributes.

You should be able to copy and paste the following code into the HTML of any page to display the calculator.

```
<div
	data-component="mmp-mortgage-calculator"
	data-google-api-key="AIzaSyDu6xnGN_mGTV5idEi92pGstYH8aOgGJwc"
	data-google-sheet-id="1bR0zYtpYTWF6xLgt9ZnxBw5sXw1Z8TzjNmaFkjbbXrU"
></div>
<link href="./dist/index.css" rel="stylesheet" type="text/css" />
<script src="./dist/index.js"></script>
```

### Google Sheets API

The calculator pulls all application data (i.e., form labels, additional copy text, calculation values, mortgage products, etc.) from a Google Sheet accessed with a Google Developer .

The following code will allow you to test that the source data is available and working as expected.

```shell
curl 'https://sheets.googleapis.com/v4/spreadsheets/1bR0zYtpYTWF6xLgt9ZnxBw5sXw1Z8TzjNmaFkjbbXrU/values:batchGet?ranges=Products&ranges=Limits&ranges=Settings&ranges=Copy&ranges=Fields&key=AIzaSyDu6xnGN_mGTV5idEi92pGstYH8aOgGJwc'
```

## Developing

To contribute to this repository, please create a fork of this repository and submit
changes as pull requests. If you want to host your own files for use, you can
create your own jsdeliver github hosted files.

In order to develop and build this project, you will need to make sure you have NPM
installed on your machine ([How to Install](https://www.npmjs.com/get-npm)). Once
that is setup, you can run the command `npm run serve` for ongoing development, or
`npm run build` to create a production bundle.

### `npm run serve`

This command will create a server that can be accessed at http://localhost:1234.
Any changes made to the source file will automatically be compiled and deployed to
this page without the need for a page refresh.

### Vue.js environment

The files are built with Vue.js. Please see [the documentation](https://vuejs.org/v3/guide/)
for more information on how to work with the "components", though it should be pretty
straightforward since the main classes are all set up.

### Building

To create a production build:

1. Run `npm run build`
2. Update the package version and update the lockfile

Commit the changes and then create a tag with the new version number.

## Monthly Payment algorithm

The current math for the monthly payment algorithm is:

```
term = 30
principal = purchasePrice - downPayment
interest = interestRate / 12
payments = term * 12

x = (1 + interest) ^ payments;
monthly = ( principal * x * interest ) / ( x - 1 )
```
