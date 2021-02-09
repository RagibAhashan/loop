import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
// import MaskedInput from 'react-text-mask';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Input } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }),
);

interface UserShippingInformation {
    email: String;
    firstName: String;
    lastName: String;
    address: String;
    phone: Number;
    postalCode: String;
    town: String;
}

interface UserBillingInformation {
    creditCardNumber: Number;
    cvc: Number;
    month: Number;
    year: Number;
}

interface TextMaskCustomProps {
    inputRef: (ref: HTMLInputElement | null) => void;
}

// function TextMaskCustom(props: TextMaskCustomProps) {
//     const { inputRef, ...other } = props;

//     return (
//       <MaskedInput
//         {...other}
//         ref={(ref: any) => {
//           inputRef(ref ? ref.inputElement : null);
//         }}
//         mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
//         placeholderChar={'\u2000'}
//         showMask
//       />
//     );
//   }

const CustomerFormdsfsdf = (/*userInfo: UserShippingInformation, creditInformation: UserBillingInformation*/) => {
    const classes = useStyles();
    const [userForm, setUserForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        phone: 514,
        postalCode: '',
        town: '',
    });

    const [userBillingInfo, setUserBillingInfo] = useState({
        creditCardNumber: 0,
        cvc: 0,
        month: 0,
        year: 0,
    });

    useEffect(() => {
        // console.log('userInfo', userInfo);
        console.log('userForm', userForm);
        // console.log('creditInformation', creditInformation)
        console.log('userBillingInfo', userBillingInfo);
    }, [userForm, userBillingInfo]);

    return (
        <form className={classes.root} noValidate autoComplete="off" style={{ backgroundColor: 'white' }}>
            <h1> Enter your shipping information </h1>
            <TextField
                required
                label="First Name"
                variant="outlined"
                defaultValue={userForm.firstName}
                value={userForm.firstName}
                onChange={(e) =>
                    setUserForm((prevState) => ({
                        ...prevState,
                        firstName: e.target.value,
                    }))
                }
            />

            <TextField
                required
                label="Last Name"
                variant="outlined"
                onChange={(e) =>
                    setUserForm((prevState) => ({
                        ...prevState,
                        lastName: e.target.value,
                    }))
                }
            />

            <TextField
                required
                label="Phone"
                variant="outlined"
                onChange={(e) =>
                    setUserForm((prevState) => ({
                        ...prevState,
                        phone: Number(e.target.value),
                    }))
                }
            />

            <TextField
                required
                label="Email"
                variant="outlined"
                onChange={(e) =>
                    setUserForm((prevState) => ({
                        ...prevState,
                        email: e.target.value,
                    }))
                }
            />

            <TextField
                required
                label="Address"
                variant="outlined"
                onChange={(e) =>
                    setUserForm((prevState) => ({
                        ...prevState,
                        address: e.target.value,
                    }))
                }
            />

            <TextField
                required
                label="Postal Code"
                variant="outlined"
                onChange={(e) =>
                    setUserForm((prevState) => ({
                        ...prevState,
                        postalCode: e.target.value,
                    }))
                }
            />

            <TextField
                required
                label="Montreal"
                variant="outlined"
                onChange={(e) =>
                    setUserForm((prevState) => ({
                        ...prevState,
                        town: e.target.value,
                    }))
                }
            />

            <hr />
            <h1> Enter your billing information </h1>
            <TextField
                required
                label="Credit Card Number"
                variant="outlined"
                onChange={(e) =>
                    setUserBillingInfo((prevState) => ({
                        ...prevState,
                        creditCardNumber: Number(e.target.value),
                    }))
                }
            />

            <Input
                // value={values.textmask}
                // onChange={handleChange}
                name="textmask"
                id="formatted-text-mask-input"
                // inputComponent={TextMaskCustom as any}
            />

            <TextField
                required
                label="CVC"
                variant="outlined"
                onChange={(e) =>
                    setUserBillingInfo((prevState) => ({
                        ...prevState,
                        cvc: Number(e.target.value),
                    }))
                }
            />

            <TextField
                required
                label="Month of Expiration"
                variant="outlined"
                onChange={(e) =>
                    setUserBillingInfo((prevState) => ({
                        ...prevState,
                        month: Number(e.target.value),
                    }))
                }
            />

            <TextField
                required
                label="Year of Expiration"
                variant="outlined"
                onChange={(e) =>
                    setUserBillingInfo((prevState) => ({
                        ...prevState,
                        year: Number(e.target.value),
                    }))
                }
            />
        </form>
    );
};

export default CustomerFormdsfsdf;
