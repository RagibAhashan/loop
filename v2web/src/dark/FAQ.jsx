import React, { Component } from "react";
import { Accordion, Card } from 'react-bootstrap';
import { FiChevronDown } from 'react-icons/fi'

const PRIMARY = 'white'
const SECONDARY = '#ff66a1'

const QuestionList = [
    {
        question: 'How much does Dynasty cost?',
        answer: '200$',
    },
    {
        question: 'How much does Dynasty cost?',
        answer: '200$',
    },
    {
        question: 'How much does Dynasty cost?',
        answer: '200$',
    },
    {
        question: 'How much does Dynasty cost?',
        answer: '200$',
    },
    {
        question: 'How much does Dynasty cost?',
        answer: '200$',
    },
]

class ServiceTwo extends Component{
    render(){
        return(
            <React.Fragment>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                        {QuestionList.map( (val, i) => (
                            <div key={i}>
                                <Accordion defaultActiveKey="" style={{border:'none'}}>
                                    <Card.Header style={{background: '#191919', cursor: 'pointer', color: PRIMARY, margin: '10px', border:'none'}}>
                                        <Accordion.Toggle as={Card.Header} eventKey="0" style={{border:'none'}}>
                                            <div>
                                                <div style={{float: 'left', width: '97.8%'}}>  {val.question} </div>
                                                <div style={{color: SECONDARY}}> <FiChevronDown /> </div>
                                            </div>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                        <Card.Body  style={{ cursor: 'pointer', color: SECONDARY}}>
                                            {val.answer}
                                        </Card.Body>
                                        </Accordion.Collapse>
                                    </Card.Header>
                                </Accordion>
                            </div>
                        ))}
                        </div>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}
export default ServiceTwo;
