import React from 'react'
import Document, {Html, Head, Main, NextScript} from 'next/document'
import Loading from './loading'

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head/>
                <body>
                    <Loading/>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument