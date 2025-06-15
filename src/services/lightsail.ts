import {
  LightsailClient as AwsLightsailClient,
  StartInstanceCommand,
  StopInstanceCommand,
  RebootInstanceCommand,
  GetInstanceCommand,
} from "@aws-sdk/client-lightsail";
import { fromEnv } from "@aws-sdk/credential-providers";

/*
 * Leaving this file as a class.
 * I wanted to see the structure of differnce of classes and functional programming
 * Classes are nice and familiar, but functional programming is better and more modern.
 * Classes are not needed in modern JavaScript/TypeScript.
 */
export class LightsailClient {
  private client: AwsLightsailClient;

  // Constructor to initialize the AWS Lightsail client
  constructor(region: string = "us-east-1") {
    this.client = new AwsLightsailClient({
      region,
      credentials: fromEnv(),
    });
  }

  async startInstance(instanceName: string): Promise<void> {
    const command = new StartInstanceCommand({
      instanceName,
    });

    await this.client.send(command);
  }

  async stopInstance(instanceName: string): Promise<void> {
    const command = new StopInstanceCommand({
      instanceName,
    });

    await this.client.send(command);
  }

  async rebootInstance(instanceName: string): Promise<void> {
    const command = new RebootInstanceCommand({
      instanceName,
    });

    await this.client.send(command);
  }

  async getInstanceState(instanceName: string): Promise<string> {
    const command = new GetInstanceCommand({
      instanceName,
    });

    const response = await this.client.send(command);

    if (!response.instance?.state?.name) {
      throw new Error("Failed to get instance state");
    }

    return response.instance.state.name;
  }
}
