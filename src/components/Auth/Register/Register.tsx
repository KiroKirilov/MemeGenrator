import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip, Form, Input, Icon, Button } from "antd";
import { memo } from "react";
import { SomeActions } from "../../../store/actions/some-actions";
import { useFirestoreConnect } from "react-redux-firebase";
import { ReduxStore } from "../../../types/redux-store";
import { FormErrorMessage } from "../../common/form-error-message/form-error-message";
import useForm from "react-hook-form";
import { FormHelpers } from "../../../common/helpers/form-helpers";
import { StringHelpers } from "../../../helpers/string-helpers";
import { default as bootstrap } from "../../../common/styles/bootstrapGrid.module.scss";
import { AuthActions } from "../../../store/actions/auth-actions";
import { ValidationHelpers } from "../../../common/helpers/validation-helpers";
import AwesomeDebouncePromise from "awesome-debounce-promise";

const delayBeforeSearch: number = 500;

const usernameIsAvailable: (usernameToRegister: string, takenUsernames: string[]) => boolean
    = (usernameToRegister: string, takenUsernames: string[]) => {
        const lowerUsernameToRegister: string = usernameToRegister.toLowerCase();
        const lowerTakenUsernames: string[] = takenUsernames.filter(Boolean).map(u => u.toLowerCase());
        return lowerTakenUsernames.indexOf(lowerUsernameToRegister) < 0;
    };

const debouncedUsernameIsAvailable: (usernameToRegister: string, takenUsernames: string[]) => boolean
    = AwesomeDebouncePromise(usernameIsAvailable, delayBeforeSearch);

export const Register: React.FC = () => {
    const { register, handleSubmit, errors, getValues, setValue, watch } = useForm({
        mode: "onBlur"
    });
    const registerError = useSelector((store: ReduxStore) => store.auth.registerError);
    const auth = useSelector((store: ReduxStore) => store.firebase.auth);
    const values = getValues();
    const dispatch = useDispatch();

    const fields = {
        email: "email",
        password: "password",
        confirmPassword: "confirmPassword",
        username: "username"
    };

    const onSubmit = (data: any) => {
        dispatch(AuthActions.register(data));
    };

    return (
        <form noValidate className={bootstrap.containerFluid} onSubmit={handleSubmit(onSubmit)}>
            {console.log("login rendered")}

            <FormErrorMessage showErrorMessage={!!registerError} errorMessage={registerError && registerError.message} />

            <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                <div className={bootstrap.col3}>
                    <Form.Item
                        validateStatus={errors.email && "error"}
                        help={errors.email && errors.email.message}>
                        <Input
                            onChange={(e) => setValue(fields.email, e.target.value)}
                            value={values.email}
                            type="email"
                            prefix={<Icon type="user" />}
                            placeholder="Email"
                            name={fields.email}
                            ref={FormHelpers.registerField(register as any, {
                                required: "Email is required.",
                                pattern: {
                                    value: ValidationHelpers.emailRegex,
                                    message: "Please provide a valid email."
                                }
                            })}
                        />
                    </Form.Item>
                </div>
            </div>

            <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                <div className={bootstrap.col3}>
                    <Form.Item
                        validateStatus={errors.username && "error"}
                        help={errors.username && errors.username.message}>
                        <Input
                            onChange={(e) => setValue(fields.username, e.target.value)}
                            value={values.username}
                            type="text"
                            prefix={<Icon type="user" />}
                            placeholder="Username"
                            name={fields.username}
                            ref={FormHelpers.registerField(register as any, {
                                required: "Username is required.",
                                minLength: {
                                    value: 3,
                                    message: "Username must be at least 3 characters long."
                                }
                            })}
                        />
                    </Form.Item>
                </div>
            </div>

            <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                <div className={bootstrap.col3}>
                    <Form.Item
                        validateStatus={errors.password && "error"}
                        help={errors.password && errors.password.message}>
                        <Input.Password
                            onChange={(e) => setValue(fields.password, e.target.value)}
                            value={values.password}
                            prefix={<Icon type="lock" />}
                            type="password"
                            placeholder="Password"
                            name={fields.password}
                            ref={FormHelpers.registerField(register as any, {
                                required: "Password is required.",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long"
                                }
                            })}
                        />
                    </Form.Item>
                </div>
            </div>

            <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                <div className={bootstrap.col3}>
                    <Form.Item
                        validateStatus={errors.confirmPassword && "error"}
                        help={errors.confirmPassword && errors.confirmPassword.message}>
                        <Input.Password
                            onChange={(e) => setValue(fields.confirmPassword, e.target.value)}
                            value={values.confirmPassword}
                            prefix={<Icon type="lock" />}
                            type="password"
                            placeholder="Confirm password"
                            name={fields.confirmPassword}
                            ref={FormHelpers.registerField(register as any, {
                                required: "Confirm password is required.",
                                validate: (value: any) => value === watch(fields.password) || "Passwords do not match."
                            })}
                        />
                    </Form.Item>
                </div>
            </div>

            <div className={StringHelpers.joinClassNames(bootstrap.row, bootstrap.justifyContentCenter)}>
                <div className={StringHelpers.joinClassNames(bootstrap.col3, bootstrap.dFlex, bootstrap.justifyContentCenter)}>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Register
                    </Button>
                </div>

            </div>
        </form>
    );
};
