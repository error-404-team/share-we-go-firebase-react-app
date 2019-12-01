    import React from 'react';
    import CssBaseline from '@material-ui/core/CssBaseline';
    import Container from '@material-ui/core/Container';
    import PropTypes from 'prop-types';

    function ContaiterBackGround(props) {

        return (
            <CssBaseline>
                <Container style={{
                    padding: 0
                }}>
                    <div style={{
                        backgroundColor: props.backgroundColor !== undefined
                            ? `${props.backgroundColor}`
                            : '#fff',
                        height: props.height !== undefined
                            ? `${props.height}`
                            : '100vh'
                    }}>
                        {props.children}
                    </div>
                </Container>
            </CssBaseline>
        );

    };

    ContaiterBackGround.propTypes = {
        backgroundColor: PropTypes.string,
        height: PropTypes.string
    };

    export default ContaiterBackGround;