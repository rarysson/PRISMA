module.exports = {
    chainWebpack: (config) => {
        config.plugin("html").tap((args) => {
            args[0].title = "PRISMA - Petri net Simulation and Modeling";
            return args;
        });
    }
};
