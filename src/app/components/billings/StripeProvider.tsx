import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PGb5sA8ZHJzSZWLkCOpOIfPZHXcfJcrxh55XyZCYzIIZqsFj6KnWIjwHifLoz1L02LhzYB4R33SuaBzZGQGIz99006eoS4Li5');

const StripeProvider = ({ children }) => {
    return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;
