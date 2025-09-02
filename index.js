#!/usr/bin/env node
// দারুণ

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import ora from "ora";
import chalk from "chalk";
import { Command } from "commander";
import figlet from "figlet";

const program = new Command();

program
    .name("darun-react-kit")
    .description("Scaffold React projects with Vite, Tailwind, Router & Axios")
    .argument("[projectName]", "name of the project")
    .option("--ts", "Use TypeScript template")
    .option("--no-git", "Skip git initialization")
    .option("-y, --yes", "Skip all prompts and use defaults")
    .parse(process.argv);

const options = program.opts();
const [cliProjectName] = program.args;

// Simple logger utility
const log = {
    success: (msg) => console.log(chalk.green(`✔ ${msg}`)),
    error: (msg) => console.error(chalk.red(`✖ ${msg}`)),
    info: (msg) => console.log(chalk.cyan(`ℹ ${msg}`)),
    warn: (msg) => console.log(chalk.yellow(`⚠ ${msg}`)),
};

async function main() {
    try {
        // Show banner
        const banner = figlet.textSync("Darun React Kit", {
            horizontalLayout: "default",
        });
        const lines = banner.split("\n");
        const maxWidth = Math.max(...lines.map((l) => l.length));

        console.log(chalk.magenta(banner));
        console.log(
            " ".repeat(maxWidth - "by Raunak".length) + chalk.gray("by Raunak")
        );
        console.log(chalk.cyan.bold("\n🚀 Welcome to Darun React Kit!\n"));

        // Step 1: Project name
        let projectName = cliProjectName;
        if (!projectName && !options.yes) {
            const answers = await inquirer.prompt([
                {
                    type: "input",
                    name: "projectName",
                    message: "Enter project name:",
                    default: "my-darun-app",
                },
            ]);
            projectName = answers.projectName;
        }
        projectName = projectName || "my-darun-app";

        const targetDir = path.join(process.cwd(), projectName);
        if (fs.existsSync(targetDir)) {
            log.error("Directory already exists. Choose another name.");
            process.exit(1);
        }

        // Step 1.5: Ask for user name
        let userName = "Developer";
        if (!options.yes) {
            const { name } = await inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "What’s your name?",
                    default: "Developer",
                },
            ]);
            userName = name;
        }

        // Step 2: Determine branch (template type)
        let branch = "main"; // default JS
        if (options.ts) {
            branch = "ts";
            log.info("Using TypeScript template (via --ts flag)");
        } else if (!options.yes) {
            const { lang } = await inquirer.prompt([
                {
                    type: "list",
                    name: "lang",
                    message: "Choose your project type:",
                    choices: ["JavaScript", "TypeScript"],
                },
            ]);
            branch = lang === "TypeScript" ? "ts" : "main";
        }

        // Step 3: Package manager choice
        let packageManager = "npm";
        if (!options.yes) {
            const { pm } = await inquirer.prompt([
                {
                    type: "list",
                    name: "pm",
                    message: "Choose your package manager:",
                    choices: ["npm", "yarn", "pnpm"],
                    default: "npm",
                },
            ]);
            packageManager = pm;
        }

        const repoUrl =
            "https://github.com/RaunakDiesFromCode/darun-react-kit.git";

        // Step 4: Clone repo
        const spinner = ora(`📦 Cloning ${branch} starter template...`).start();
        try {
            execSync(
                `git clone -b ${branch} --single-branch ${repoUrl} ${projectName}`,
                {
                    stdio: "ignore",
                }
            );
            spinner.succeed("Template cloned!");
        } catch (err) {
            spinner.fail("Failed to clone repo.");
            log.error(
                "Make sure Git is installed and you have internet access."
            );
            process.exit(1);
        }

        // Step 5: Clean old git
        fs.rmSync(path.join(targetDir, ".git"), {
            recursive: true,
            force: true,
        });

        // Step 6: Update package.json
        const pkgPath = path.join(targetDir, "package.json");
        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
            pkg.name = projectName;
            pkg.version = "1.0.0";
            pkg.description = `${projectName} - bootstrapped with Darun React Kit`;
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        }

        // Step 7: Create .env
        fs.writeFileSync(
            path.join(targetDir, ".env"),
            `# Example .env file\nVITE_API_URL=https://jsonplaceholder.typicode.com\n`
        );

        // Step 8: Install dependencies
        const installSpinner = ora("🔧 Installing dependencies...").start();
        try {
            execSync(`${packageManager} install`, {
                cwd: targetDir,
                stdio: "ignore",
            });
            installSpinner.succeed("Dependencies installed!");
        } catch (err) {
            installSpinner.fail("Dependency installation failed.");
            log.error("Check your package manager installation.");
            process.exit(1);
        }

        // Step 9: Git init
        if (options.git) {
            const gitSpinner = ora("⚡ Initializing git repo...").start();
            try {
                execSync("git init", { cwd: targetDir, stdio: "ignore" });
                execSync("git add .", { cwd: targetDir, stdio: "ignore" });
                execSync('git commit -m "Init project from Darun React Kit"', {
                    cwd: targetDir,
                    stdio: "ignore",
                });
                gitSpinner.succeed("Git repo initialized!");
            } catch (err) {
                gitSpinner.fail("Git init failed.");
            }
        }

        // Step 10: Personalize Home.jsx
        const homePath = path.join(targetDir, "src/pages/Home.jsx");
        if (fs.existsSync(homePath)) {
            let content = fs.readFileSync(homePath, "utf-8");
            // Add greeting inside <div> (after Home Page heading)
            content = content.replace(
                /<h1[^>]*>Home Page<\/h1>/,
                `<h1 className="text-2xl font-bold">Home Page</h1>\n            <p className="mt-2">Hi ${userName} 👋</p>`
            );
            fs.writeFileSync(homePath, content, "utf-8");
            log.success(`Personalized Home.jsx with greeting for ${userName}`);
        }

        // Done!
        console.log(chalk.green.bold("\n✅ Project setup complete!"));
        log.info("Next steps:");
        console.log(
            `\n   ${chalk.yellow(`cd ${projectName}`)}\n   ${chalk.yellow(
                `${packageManager} run dev`
            )}\n`
        );
    } catch (err) {
        if (err.name === "ExitPromptError") {
            console.log(chalk.red("\n❌ Setup cancelled by user (Ctrl+C)."));
            process.exit(0); // clean exit
        } else {
            console.error(chalk.red("Unexpected error:"), err);
            process.exit(1);
        }
    }
}

// Handle Ctrl+C anywhere (outside of prompts too)
process.on("SIGINT", () => {
    console.log(chalk.red("\n❌ Setup cancelled by user (Ctrl+C)."));
    process.exit(0);
});

main();
