import { ChatConfigurator } from "src/utils/ChatConfigurator";
import { PollsConfiguration } from "./PollsConfiguration";
import { PollsExtensionDecorator } from "./PollsExtensionDecorator";
import { ExtensionsId } from "../Extensions/ExtensionsId";
import { ExtensionsDataSource } from "../Extensions/ExtensionsDataSource";

export class PollsExtension extends ExtensionsDataSource {
  private configuration?: PollsConfiguration;

  constructor(configuration?: PollsConfiguration) {
    super();
    this.configuration = configuration;
  }

  override addExtension(): void {
    ChatConfigurator.enable(
      (dataSource: any) => new PollsExtensionDecorator(dataSource, this.configuration)
    );
  }

  override getExtensionId(): string {
    return ExtensionsId.polls;
  }
}
