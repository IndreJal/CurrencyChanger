// Import statements comes here.
import React  from 'react';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

// You need to extend the functionality of `Component` to the class created.
class Action extends React.Component {
    constructor() {
        super();

        this.state = {
            currencyList: [
                {id: 1, currency: "EUR"},
                {id: 2, currency: "USD"},
                {id: 3, currency: "CHF"},
                {id: 4, currency: "BTN"},
                {id: 5, currency: "ZAD"},
                {id: 6, currency: "AUD"},
                {id: 7, currency: "LRD"},
                {id: 8, currency: "AED"},
                {id: 9, currency: "ADP"}
            ],
            currencyFrom: "EUR",
            currencyTo: "USD",
            convertedAmount: 0
        }
    }

    handleCurrencyFromChange(e) {
        console.log("1. state currFrom: " + this.state.currencyFrom);
        console.log("2. passed in curr : " + e);
        let newCurrFrom = this.state.currencyFrom;
        newCurrFrom = e;
        this.setState({currencyFrom: newCurrFrom});

        console.log("3. state currFrom: " + this.state.currencyFrom);
    }

    handleCurrencyToChange(e) {
        console.log("1. state currFrom: " + this.state.currencyFrom);
        console.log("2. passed in curr : " + e);
        let newCurrTo = this.state.currencyTo;
        newCurrTo = e;
        this.setState({currencyTo: newCurrTo});

        console.log("3. state currFrom: " + this.state.currencyFrom);
    }

    handleAmountChange(e){
        console.log("amount passed: " + e);
        let newAmount = this.state.convertedAmount;
        newAmount = e * 2;
        this.setState({convertedAmount: newAmount});
    }

    // This function renders a component
    render() {
        // Whatever is returned is rendered
        return (
            <Form>
                <FormGroup row>
                    <Label for="currencyFrom" sm={2}>Currency from</Label>
                    <Col sm={100}>
                        <Input type="select" name="select" id="exampleSelect" defaultValue={this.state.currencyFrom}
                            onChange={(event) => this.handleCurrencyFromChange(event.target.value)}
                            >
                            {this.state.currencyList.map(currency => (
                                <option key={currency.id}> {currency.currency} </option>
                            ))}    
                            
                        </Input>
                    </Col>
                </FormGroup>
                

                <FormGroup row>
                    <Label for="currencyTo" sm={2}>Currency to</Label>
                    <Col sm={100}>
                        <Input type="select" name="select" id="exampleSelect" defaultValue={this.state.currencyTo}
                            onChange={(event) => this.handleCurrencyToChange(event.target.value)}>
                            {this.state.currencyList.map(currency => (
                                <option key={currency.id}> {currency.currency} </option>
                            ))} 
                        </Input>
                    </Col>
                </FormGroup>
                  
                <FormGroup row>
                    <Label for="amount" sm={2}>Amount to convert</Label>
                    <Col sm={100}>
                        <Input placeholder="Amount" min={0} type="number"  name="text" id="amount" 
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