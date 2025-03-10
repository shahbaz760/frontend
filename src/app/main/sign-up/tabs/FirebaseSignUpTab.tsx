import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { SignUpPayload } from '../../../auth/AuthRouteProvider';

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		displayName: z.string().nonempty('You must enter your name'),
		email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
		password: z
			.string()
			.nonempty('Please enter your password.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
		passwordConfirm: z.string().nonempty('Password confirmation is required'),
		acceptTermsConditions: z.boolean().refine((val) => val === true, 'The terms and conditions must be accepted.')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});

const defaultValues = {
	displayName: '',
	email: '',
	password: '',
	passwordConfirm: '',
	acceptTermsConditions: false
};

function FirebaseSignUpTab() {
	// const { firebaseService } = useAuth();

	const { control, formState, handleSubmit, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(formData: SignUpPayload) {
		const { displayName, email, password } = formData;
		// firebaseService?.signUp(email, password, displayName).catch((_error) => {
		// 	const error = _error as firebase.auth.Error;

		// 	const usernameErrorCodes = ['auth/operation-not-allowed', 'auth/user-not-found', 'auth/user-disabled'];

		// 	const emailErrorCodes = ['auth/email-already-in-use', 'auth/invalid-email'];

		// 	const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];

		// 	const errors: {
		// 		type: 'displayName' | 'email' | 'password' | `root.${string}` | 'root';
		// 		message: string;
		// 	}[] = [];

		// 	if (usernameErrorCodes.includes(error.code)) {
		// 		errors.push({
		// 			type: 'displayName',
		// 			message: error.message
		// 		});
		// 	}

		// 	if (emailErrorCodes.includes(error.code)) {
		// 		errors.push({
		// 			type: 'email',
		// 			message: error.message
		// 		});
		// 	}

		// 	if (passwordErrorCodes.includes(error.code)) {
		// 		errors.push({
		// 			type: 'password',
		// 			message: error.message
		// 		});
		// 	}

		// 	errors.forEach((err) => {
		// 		setError(err.type, {
		// 			type: 'manual',
		// 			message: err.message
		// 		});
		// 	});
		// });
	}

	return (
		<form
			name="registerForm"
			noValidate
			className="mt-32 flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="displayName"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Display name"
						autoFocus
						error={!!errors.displayName}
						helperText={errors?.displayName?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Email"
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Password"
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
						sx={{
							".MuiInputBase-input": {
							  paddingRight: "34px",
							},
						  }}
					/>
				)}
			/>

			<Controller
				name="passwordConfirm"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Password (Confirm)"
						type="password"
						error={!!errors.passwordConfirm}
						helperText={errors?.passwordConfirm?.message}
						variant="outlined"
						required
						fullWidth
						sx={{
							".MuiInputBase-input": {
							  paddingRight: "34px",
							},
						  }}
					/>
				)}
			/>

			<Controller
				name="acceptTermsConditions"
				control={control}
				render={({ field }) => (
					<FormControl
						className="items-center"
						error={!!errors.acceptTermsConditions}
					>
						<FormControlLabel
							label="I agree to the Terms of Service and Privacy Policy"
							control={
								<Checkbox
									size="small"
									{...field}
								/>
							}
						/>
						<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
					</FormControl>
				)}
			/>

			<Button
				variant="contained"
				color="secondary"
				className="mt-24 w-full"
				aria-label="Register"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
			>
				Create your free account
			</Button>
		</form>
	);
}

export default FirebaseSignUpTab;
