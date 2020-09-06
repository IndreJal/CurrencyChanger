// Import statements comes here.
import React  from 'react';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

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
        this.getCurrencyList();
        this.setDefaultValues();
    }

    getCurrencyList = _ => {
        fetch(`http://localhost:4000/currencies`)
        .then(response => response.json())
        .then(response => { this.setState({currencyList: response.data}) })
        .catch(err => console.error(err))
    }

    setDefaultValues = _ => {
        fetch(`http://localhost:4000/currencies/get?CurrencyCode=EUR`)
        .then(response => response.json())
        .then(response => { this.setState({currencyFrom: {CurrencyId: response.data[0].CurrencyId, CurrencyCode: response.data[0].CurrencyCode} }) })
        .catch(err => console.error(err));

        fetch(`http://localhost:4000/currencies/get?CurrencyCode=USD`)
        .then(response => response.json())
        .then(response => { this.setState({currencyTo: {CurrencyId: response.data[0].CurrencyId, CurrencyCode: response.data[0].CurrencyCode} }) })
        .catch(err => console.error(err));
    }

    handleCurrencyFromChange(currCode) {
        fetch(`http://localhost:4000/currencies/get?CurrencyCode=${currCode}`)
        .then(response => response.json())
        .then(response => { 
                this.setState({currencyFrom: {CurrencyId: response.data[0].CurrencyId, CurrencyCode: response.data[0].CurrencyCode} }) 
                this.convertAmount(this.state.amount, response.data[0].CurrencyId, this.state.currencyTo.CurrencyId)
            })    
        .catch(err => console.error(err));
    }

    handleCurrencyToChange(currCode) {
        fetch(`http://localhost:4000/currencies/get?CurrencyCode=${currCode}`)
        .then(response => response.json())
        .then(response => { 
                this.setState({currencyTo: {CurrencyId: response.data[0].CurrencyId, CurrencyCode: response.data[0].CurrencyCode} }) 
                this.convertAmount(this.state.amount, this.state.currencyFrom.CurrencyId, response.data[0].CurrencyId)
            })  
        .catch(err => console.error(err));
    }

    handleAmountChange(e){
        let newAmount = this.state.amount;
        newAmount = e;
        this.setState({amount: newAmount});
        this.convertAmount(e, this.state.currencyFrom.CurrencyId, this.state.currencyTo.CurrencyId);        
    }

    convertAmount(amnt, from, to) {
        fetch(`http://localhost:4000/exchangeRates/get?CurrencyFrom=${from}&CurrencyTo=${to}`)
        .then(response => response.json())
        .then(response => { 
                this.setState( {convertedAmount: amnt * response.data[0].ExchangeRate});
                this.logUsage(amnt, amnt * response.data[0].ExchangeRate, from, to, response.data[0].ExchangeRate);
            } )
        .catch(err => console.error(err));
    }

    logUsage(amount, amountConverted, currencyFrom, currencyTo, exchangeRate) {
        fetch(`http://localhost:4000/logs/log?AmountToConvert=${amount}&AmountConverted=${amountConverted}&CurrencyIdFrom=${currencyFrom}&CurrencyIdTo=${currencyTo}&ExchangeRate=${exchangeRate}`)
        .then(response => response.json())
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
                            onChange={(event) => this.handleCurrencyToChange(event.target.value, event.target.key)}>
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