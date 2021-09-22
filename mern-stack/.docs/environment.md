# Environment

## General View

When setting up the environment there are multiple aspects to consider in order to choose the proper tooling and plan for a continuous improvement strategy in order to ramp up on specific tech:

- Dev stack: this project uses `MERN` stack which comes from `Mongo Express React Node`
  - `Mongo` - as the main Database
  - `Express` - as the back-end web app framework
  - `React` - as the front-end development framework
  - `Node` - as the main framework and runtime for back-end and for build related tasks in case of front-end
- DevOps stack:
  - `GitHub Workflows` - used to implement CI/CD
  - `AWS` - used as the main cloud provider for infrastructure
    - in addition to general features like IAM, EC2, VPC, Route53, ... there are also some specific ones:
      - `EKS` - managed Kubernetes cluster used for orchestration
      - `ECR` - container registry
  - `Docker` - for containerization

## Tools

Below is a list of development tools for MacOS:

| Type           | Link                                                            | Description                                                                                     |
| -------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| IDE            | [Visual Studio Code](https://code.visualstudio.com/)            | Install additional [extensions](#visual-studio-code-extensions) for a complete dev environment. |
| Terminal       | [iTerm 2](https://iterm2.com/)                                  | feature rich Terminal alternative                                                               |
| Shell          | [oh-my-zsh](https://ohmyz.sh/)                                  | `zsh` bundle with lots of plugins and configuration                                             |
| Node.js        | [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)    | Node version manager                                                                            |
|                | [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) | Package manager                                                                                 |
| DB             | [MongoDB Compass](https://www.mongodb.com/products/compass)     | MongoDB IDE                                                                                     |
| Infrastructure | [Docker](https://www.docker.com/get-started)                    | Docker CLI and daemon for starting containers locally                                           |
|                | [kubectl](https://kubernetes.io/docs/tasks/tools/)              | CLI for interacting with the K8S API                                                            |
|                | [k9s](https://k9scli.io/)                                       | K8S text based graphical tool used for management                                               |
|                | [kustomize](https://kustomize.io/)                              | CLI for K8S specs customization                                                                 |

## Visual Studio Code Extensions

Below are a few useful `Visual Studio Code` extensions that can be installed from the `Extensions` tab:

| Extension                | Description                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Draw.io Integration      | diagraming support for Draw.io files                                                                             |
| Path Intellisense        | path autocompletion                                                                                              |
| Auto Close Tag           | auto close tags.                                                                                                 |
| Markdown All in One      | additional Markdown integrations                                                                                 |
| Docker                   | Docker integration                                                                                               |
| Kubernetes               | K8S integration                                                                                                  |
| AWS Toolkit              | AWS Integration                                                                                                  |
| HashiCorp Terraform      | Terraform integration                                                                                            |
| GitLens                  | feature rich Git integration                                                                                     |
| Material Icon Theme      | theme to customize the feel and look of your IDE                                                                 |
| vscode-styled-components | syntax highlighting for styled-components                                                                        |
| EditorConfig for VS Code | support for .editorconfig files                                                                                  |
| PlantUML                 | support for editing and visualizing PlantUML graphs                                                              |
| Reveal                   | adds an icon to reveal the file in sidebar; you should also disable auto reveal - `"explorer.autoReveal": false` |

## Certificate Issues

As long as the VPN is used, every communication, including SSL/TLS, will go through a proxy.

This proxy changes the certificate of each secured communication, which involves that:

- communication with the external party (eg: google.com) will be done using the original certificate
- communication with the internal party (you) will be done using the company certificate
- the company is able to decrypt the secured communication
- a certificate will be issued for each connection signed by the MM CA certificate

Currently the MM CA certificate chain is a self-signed certificate, which means that was created by the company and not issued by a well known trusted Certificate Authority. 

Being a self-signed certificate means that is not trusted, and therefore needs to be trusted explicitly.

Trusting a given certificate differs from environment to environment, CLI, SDK, OS, ...

Therefore you need to use the appropriate procedure to mark the respective company certificates as trusted.

You can find these procedures documented on the following locations:
- [Jumpstart Team Onboarding](https://massmutual.atlassian.net/wiki/spaces/EA/pages/4061692958/Getting+Started+for+Contributor#MassMutual-AWS-CLI-Certificates-setup)
- [Fixes per Domain](https://massmutual.atlassian.net/wiki/spaces/AAP/pages/875790377/Fix+TLS+SSL+certificate+verification+failures)

**WARNING:** Another option is to disable certificate validation, but this is not recommended because is a security breach.

Disabling certificate validation means that a party can get in the middle, change the certificate in order to decrypt the message, and steal your data in transfer (eg: credentials).

This is called `MITM (Man-in-the-Middle-Attack).

Therefore try to avoid skipping certificate validation as this practice is dangerous.

## Interacting with AWS

You can interact with AWS via:

- AWS Management Console - web interface
- AWS CLI - used to provision and interact with services from terminal
- CDK - programmatically, used for IaC
- SDK - programmatically, used to interact with services
- IDE plugins (eg: Visual Studio Code - AWS Toolkit)

### AWS Credentials

In order to interact with AWS from a specific machine one needs to correctly setup the credentials in order for the underlying tools or frameworks to authenticate to AWS STS and obtain a session token so that any further interaction is considered to be authenticated.

In order to authenticate one can choose to authenticate using:

- **a specific user**
  - this involves having a user created in IAM
  - this means that if credentials are discovered by hackers they will gain access for the whole availability of the user 
- **assuming a role**
  - this involves assuming a role via STS without actually having a user
  - STS gives a token which has an expiration date, which means that is the preferred way to authenticate because it does not exposes
  - usually authentication starts by having an AD user within the company and then authenticating into massmutual.okta.com then clicking on a specific AWS icon
    - if there is no such icon then you might need to create a [MAX request](https://massmutual.service-now.com/sp_main/?id=sc_cat_item&sys_id=ba33b4e7dba5a7447ffe0a45ca9619c8) in order to attach an AD role to your AD User via

You need to install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html) and then use the correct procedure to obtain the correct credentials:

- **a specific user**
  - you need to create an `access key` from your account (top-right > My Security Credentials > AWS IAM Credentials > Create access key)
  - use `aws configure` in order to specify the credentials displayed for the respective `access key`, and then name your profile
- **assuming a role**
  - follow the steps from the respective [documentation](https://massmutual.atlassian.net/wiki/spaces/EA/pages/4061692958/Getting+Started+for+Contributor#MassMutual-Temp-Credential-Setup)
  - you'll need to be inside the VPN in order to have a user token (Kerberos via AD) based on which a role can be assumed

After authenticating, these settings can be found under `~/.aws` directory in the form of `profiles`:

- `config` - profile configurations (eg: region)
- `credentials` - profile credentials (eg: access key ID, secret access key, session token)

Therefore interacting with AWS requires a `profile` to be specified.

When using CLI tools usually this is specified using `--profile <profile>` flag.

If no profile is specified the CLI picks up the `default` profile.

You can also specify a profile by setting the `AWS_PROFILE` env variable to a given profile.

### EKS

EKS (Elastic Kubernetes Service) is a Managed Kubernetes Service which is an Enterprise grade Kubernetes cluster.

Any prior K8S experience will be useful in interacting with this service.

Like any other K8S cluster, in order to interact to it you need to have a `context` setup locally which describes where the cluster is located and how to authenticate to it.

In order to create a `context` AWS CLI offers the following procedure:

```bash
# Complete with the appropriate data.
# format: aws eks --region <region-code> update-kubeconfig --name <cluster_name>
aws eks --region us-east-1 update-kubeconfig --name ea-devops-eks
```

After running the above command you can check the `~/.kube/config` to see how the added `context` looks like.

When working with contexts you can use the following commands:

```bash
# all contexts
kubectl config get-contexts

# current context
kubectl config current-context

# set context (use your context)
kubectl config set-context arn:aws:eks:us-east-1:782259420937:cluster/ea-devops-eks
```

Next you can add additional tooling, described in [Tools](#tools) section:

- `kubectl`
- `k9s`
- `kustomize`

There are also other tools and don't hesitate to add them to the documentation if you find any of them useful.
