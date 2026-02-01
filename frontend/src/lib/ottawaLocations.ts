export type DemoLocation = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

export const CARLETON: DemoLocation = {
  id: "carleton",
  label: "Carleton University",
  lat: 45.3876,
  lng: -75.696,
};

export const OTTAWA_LOCATIONS: DemoLocation[] = [
  CARLETON,

  { id: "uottawa", label: "University of Ottawa", lat: 45.4231, lng: -75.6831 },
  { id: "rideau", label: "CF Rideau Centre", lat: 45.4256, lng: -75.6924 },
  { id: "byward", label: "ByWard Market", lat: 45.4277, lng: -75.6922 },
  { id: "parliament", label: "Parliament Hill", lat: 45.4236, lng: -75.7009 },
  { id: "lansdowne", label: "Lansdowne Park", lat: 45.3989, lng: -75.6833 },
  {
    id: "ottawa_station",
    label: "Ottawa Station (VIA Rail)",
    lat: 45.4166,
    lng: -75.6513,
  },
  { id: "orleans", label: "Orléans", lat: 45.4765, lng: -75.5119 },
  { id: "mooneys_bay", label: "Mooney’s Bay", lat: 45.3666, lng: -75.684 },
  { id: "kanata", label: "Kanata", lat: 45.309, lng: -75.898 },
  { id: "bayshore", label: "Bayshore", lat: 45.3484, lng: -75.8079 },
];
