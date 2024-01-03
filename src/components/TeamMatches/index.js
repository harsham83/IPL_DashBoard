import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: {},
    searchText: '',
    filteredData: [],
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(match)

    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    const formattedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatch: this.getFormattedData(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map(eachMatch =>
        this.getFormattedData(eachMatch),
      ),
    }

    this.setState({teamMatchesData: formattedData, isLoading: false})
  }

  getSearchText = event => {
    const {teamMatchesData, searchText} = this.state
    const filteredList = teamMatchesData.recentMatches.filter(each =>
      each.competingTeam.toLowerCase().includes(searchText.toLowerCase()),
    )
    this.setState({
      searchText: event.target.value,
      filteredData: filteredList,
    })
    console.log(event.target.value)
  }

  renderRecentMatchesList = () => {
    const {teamMatchesData, searchText, filteredData} = this.state
    const {recentMatches} = teamMatchesData
    const finalList = searchText === '' ? recentMatches : filteredData

    return (
      <>
        <div className="searchBar">
          <input
            className="searchInp"
            type="search"
            placeholder="Search Recent Matches"
            value={searchText}
            onChange={this.getSearchText}
          />
        </div>
        <ul className="recent-matches-list">
          {finalList.length !== 0 ? (
            finalList.map(recentMatch => (
              <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
            ))
          ) : (
            <div>
              <h1 className="notFound">
                The team you are searching for is not available. Please consider
                searching for a different team.
              </h1>
            </div>
          )}
        </ul>
      </>
    )
  }

  renderTeamMatches = () => {
    const {teamMatchesData} = this.state
    const {teamBannerURL, latestMatch} = teamMatchesData
    console.log(teamMatchesData)

    return (
      <div className="responsive-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchData={latestMatch} />
        {this.renderRecentMatchesList()}
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-container ${this.getRouteClassName()}`

    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
