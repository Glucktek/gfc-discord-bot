import {
  LightsailClient as AwsLightsailClient,
  StartInstanceCommand,
  StopInstanceCommand,
  RebootInstanceCommand,
  GetInstanceCommand,
} from "@aws-sdk/client-lightsail";
import { fromEnv } from "@aws-sdk/credential-providers";

export class LightsailClient {
  private client: AwsLightsailClient;

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
