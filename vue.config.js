module.exports = {
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = "PRISMA - Petri Net Simulation and Modeling";
            return args;
        });
    }
};
