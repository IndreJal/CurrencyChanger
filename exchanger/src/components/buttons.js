// Import statements comes here.
import React  from 'react';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';
//import { response } from 'express';
//import { response } from 'express';

// You need to extend the functionality of `Component` to the class created.
class Action extends React.Component {
    constructor() {
        super();

        this.state = {
            currencyList: [],
            currencyFrom: {CurrencyId: 0, CurrencyCode: 'XXX'},
            currencyTo: [],
            amount: 0,
            convertedAmount: 0
        }
    }

    componentDidMount() {
        console.log("component mount");
        this.getCurrencyList();
        this.setDefaultCurrencies();
    }

    getCurrencyList = _ => {
        fetch('http://localhost:4000/currencies')
        .then(response => response.json())
        .then(response => { this.setState({currencyList: response.data}) })
        //.then( ({data}) => { console.log("data: " + data[0].CurrencyId) })
        .catch(err => console.error(err))
    }

    setDefaultCurrencies = _ => {
        fetch('http://localhost:4000/currencies/get?CurrencyCode=EUR')
        .then(response => response.json())
        .then(response => { this.setState({currencyFrom: {CurrencyId: response.data[0].CurrencyId, CurrencyCode: response.data[0].CurrencyCode} }) })
        //.then( ({data}) => { console.log("data: " + data[0].CurrencyCode) })
        .catch(err => console.error(err));

        fetch('http://localhost:4000/currencies/get?CurrencyCode=USD')
        .then(response => response.json())
        .then(response => { this.setState({currencyTo: {CurrencyId: response.data[0].CurrencyId, CurrencyCode: response.data[0].CurrencyCode} }) })
        .catch(err => console.error(err));
    }

    handleCurrencyFromChange(e) {
        console.log("handleCurrencyFromChange: passed in curr : " + e);

        fetch('http://localhost:4000/currencies/get?CurrencyCode=' + e)
        .then(response => response.json())
        .then(response => { this.setState({currencyFrom: {CurrencyId: response.data[0].CurrencyId, CurrencyCode: response.data[0].CurrencyCode} }) })
        //.then( ({data}) => { console.log("data: " + data[0].CurrencyCode) })
        .catch(err => console.error(err));

        this.convertAmount();
    }

    handleCurrencyToChange(e) {
        console.log("handleCurrencyToChange: passed in curr : " + e);

        fetch('http://localhost:4000/currencies/get?CurrencyCode=' + e)
        .then(response => response.json())
        .then(response => { this.setState({currencyTo: {CurrencyId: response.data[0].CurrencyId, CurrencyCode: response.data[0].CurrencyCode} }) })
        //.then( ({data}) => { console.log("data: " + data[0].CurrencyCode) })
        .catch(err => console.error(err));

        this.convertAmount();
    }

    handleAmountChange(e){
        console.log("amount passed: " + e);
        console.log("curr from: " + this.state.currencyFrom.CurrencyCode);
        console.log("curr to: " + this.state.currencyTo.CurrencyCode);

        let newAmount = this.state.amount;
        newAmount = e;
        this.setState({amount: newAmount});

        this.convertAmount();        
    }

    convertAmount() {
        console.log("convertAmount: currFrom: " + this.state.currencyFrom.CurrencyCode);
        console.log("convertAmount: currTo: " + this.state.currencyTo.CurrencyCode);
        console.log("convertAmount: amount: " + this.state.amount);
        console.log("convertAmount: convertedAmount: " + this.state.convertedAmount);

        fetch('http://localhost:4000/exchangeRates/get?CurrencyFrom=' 
            + this.state.currencyFrom.CurrencyId 
            + '&CurrencyTo='
            + this.state.currencyTo.CurrencyId )
        .then(response => response.json())
        .then(response => { this.setState( {convertedAmount: this.state.amount * response.data[0].ExchangeRate}) } )
        .catch(err => console.error(err));
    }

    // This function renders a component
    render() {
        // Whatever is returned is rendered
        return (
            <Form>
                <FormGroup row>
                    <Label for="currencyFrom" sm={2}>Currency from</Label>
                    <Col sm={100}>
                        <Input type="select" name="select" id="exampleSelect" value={this.state.currencyFrom.CurrencyCode}
                            onChange={ (event) => this.handleCurrencyFromChange(event.target.value)} >
                            {
                                this.state.currencyList.map(currency => (
                                <option key={currency.CurrencyId}> {currency.CurrencyCode} </option>
                            ))}    
                            
                        </Input>
                    </Col>
                </FormGroup>
                

                <FormGroup row>
                    <Label for="currencyTo" sm={2}>Currency to</Label>
                    <Col sm={100}>
                        <Input type="select" name="select" id="exampleSelect" value={this.state.currencyTo.CurrencyCode}
                            onChange={(event) => this.handleCurrencyToChange(event.target.value)}>
                            {this.state.currencyList.map(currency => (
                                <option key={currency.CurrencyId}> {currency.CurrencyCode} </option>
                            ))} 
                        </Input>
                    </Col>
                </FormGroup>
                  
                <FormGroup row>
                    <Label for="amount" sm={2}>Amount to convert</Label>
                    <Col sm={100}>
                        <Input min={0} type="number"  name="text" id="amount" defaultValue={this.state.amount} 
                            onChange={(event) => this.handleAmountChange(event.target.value)}/>
                    </Col>
                </FormGroup>


                <FormGroup row>
                    <Label for="converted" sm={2}>Converted</Label>
                    <Col sm={100}>
                        <Input placeholder="Converted" type="number" name="text" id="converted" 
                            value={this.state.convertedAmount} readOnly/>
                    </Col>
                </FormGroup>
            </Form>
        );
    }
}

export default Action;