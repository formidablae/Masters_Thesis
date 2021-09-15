import React, {Fragment} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import {ApolloClient, InMemoryCache} from '@apollo/client';
import dotenv from 'dotenv';

dotenv.config();

const myApolloClient = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}`,
    cache: new InMemoryCache()
});

function App() {
    return (
        <div className="App">
            <Fragment>
                <Header/>
                <Content/>
                <Footer/>
            </Fragment>
        </div>
    );
};

export {App, myApolloClient};
