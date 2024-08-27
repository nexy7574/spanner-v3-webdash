import {Component} from "react";
import * as util from "../util";
import './guildSideBar.css'
import Link from "next/link";
import Image from "next/image";
import {Spinner} from "../util";

function defaultGuildIconURL(id) {
  return `https://cdn.discordapp.com/embed/avatars/${id % 6}.png`;
}


function guildIconUrl(guild_id, icon_hash) {
  return icon_hash ? `https://cdn.discordapp.com/icons/${guild_id}/${icon_hash}.webp?size=256` : defaultGuildIconURL(guild_id);
}


export default class GuildSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      guilds: []
    };
  }

  async getGuilds() {
    const guilds = await util.processedGuilds();
    this.setState({guilds});
  }

  componentDidMount() {
    if(this.loaded) return;
    this.getGuilds().then(() => {this.setState({loaded: true})}).catch(console.error);
  }

  render() {
    function onError(e) {
      e.target.src = defaultGuildIconURL(e.target.dataset.guild_id || 1);
    }
    if(!this.state.loaded || !this.state.guilds) {
      return (
        <div className={"guild-side-bar"}>
          <div className={"guild-side-bar-inner"}>
            <Spinner size={2}/>
          </div>
        </div>
      )
    }

    return (
      <div className={"guild-side-bar"}>
        <div className={"guild-side-bar-inner"}>
          {this.state.guilds.toSorted((a, b) => {}).map((guild) => {
            return (
              <Link href={`/guilds/${guild.id}`} key={guild.id}>
                <Image
                  src={guild.icon_url || guildIconUrl(guild.id, guild.icon)}
                  width={50}
                  height={50}
                  alt={guild.name}
                  className={"guild-side-bar-icon " + (guild.present ? '' : 'absent')}
                  data-guild_id={guild.id}
                  title={guild.name}
                  disabled={!guild.present}
                  onError={onError}
                />
              </Link>
            )
          })}
        </div>
      </div>
    );
  }
}
