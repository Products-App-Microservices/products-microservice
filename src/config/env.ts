export const EnvConfig = () => ({
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});