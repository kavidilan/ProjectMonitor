import React, { useMemo, useState } from 'react';
import { CircleMarker, LayersControl, MapContainer, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import {
  DISTRICT_COORDS,
  PROVINCE_CENTERS,
  SRI_LANKA_PROVINCES,
  getProvinceFromDistrict,
  normalizeDistrictName,
} from '../utils/districtCoords';

// Fix default marker icon URLs under CRA builds (Leaflet expects assets in a specific place)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const SRI_LANKA_BOUNDS = [
  [5.65, 79.45],
  [10.05, 82.1],
];

const budgetColor = (budgetLine = '') => {
  const k = String(budgetLine).toLowerCase();
  if (k.includes('transport')) return '#f59e0b';
  if (k.includes('housing')) return '#8b5cf6';
  if (k.includes('utility')) return '#22c55e';
  if (k.includes('community')) return '#ef4444';
  if (k.includes('tourism')) return '#0ea5e9';
  if (k.includes('clean sri lanka')) return '#22c55e';
  if (k.includes('techcity')) return '#f97316';
  if (k.includes('siyak nagara')) return '#0891b2';
  if (k.includes('uda own funded')) return '#6366f1';
  if (k.includes('jaffna townhall')) return '#ec4899';
  if (k.includes('solid waste')) return '#10b981';
  if (k.includes('consultancy')) return '#8b5cf6';
  if (k.includes('25 cities')) return '#06b6d4';
  if (k.includes('10 cities')) return '#a855f7';
  return '#0ea5e9';
};

const MapView = ({ projects }) => {
  const [selectedProvince, setSelectedProvince] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const stats = useMemo(() => {
    const total = projects.length;
    const delayed = projects.filter(p => p.reasonsForDelays).length;
    const onTrack = total - delayed;
    const located = projects.filter((p) => {
      const district = normalizeDistrictName(p?.district);
      return Boolean(DISTRICT_COORDS[district]);
    }).length;
    return { total, delayed, onTrack, located };
  }, [projects]);

  const projectsWithGeo = useMemo(() => {
    return projects.map((p) => {
      const district = normalizeDistrictName(p?.district) || 'Unknown';
      const province = getProvinceFromDistrict(district);
      const coords = DISTRICT_COORDS[district] || null;
      const isDelayed = Boolean(p?.reasonsForDelays && String(p.reasonsForDelays).trim());
      return { project: p, district, province, coords, isDelayed };
    });
  }, [projects]);

  const provinceStats = useMemo(() => {
    const acc = new Map(SRI_LANKA_PROVINCES.map((name) => [name, { province: name, total: 0, delayed: 0, onTrack: 0 }]));

    for (const row of projectsWithGeo) {
      if (row.province === 'Unknown') continue;
      const prev = acc.get(row.province) || { province: row.province, total: 0, delayed: 0, onTrack: 0 };
      prev.total += 1;
      prev.delayed += row.isDelayed ? 1 : 0;
      prev.onTrack += row.isDelayed ? 0 : 1;
      acc.set(row.province, prev);
    }

    return Array.from(acc.values()).sort((a, b) => b.total - a.total || String(a.province).localeCompare(String(b.province)));
  }, [projectsWithGeo]);

  const districtStats = useMemo(() => {
    const acc = new Map();
    for (const p of projects) {
      const key = normalizeDistrictName(p?.district) || 'Unknown';
      const prev = acc.get(key) || { district: key, total: 0, delayed: 0, onTrack: 0 };
      const isDelayed = Boolean(p?.reasonsForDelays && String(p.reasonsForDelays).trim());
      prev.total += 1;
      prev.delayed += isDelayed ? 1 : 0;
      prev.onTrack += isDelayed ? 0 : 1;
      acc.set(key, prev);
    }
    return Array.from(acc.values()).sort((a, b) => b.total - a.total || String(a.district).localeCompare(String(b.district)));
  }, [projects]);

  const visibleProjects = useMemo(() => {
    let rows = projectsWithGeo;
    if (selectedProvince !== 'ALL') rows = rows.filter((row) => row.province === selectedProvince);
    if (statusFilter === 'DELAYED') rows = rows.filter((row) => row.isDelayed);
    if (statusFilter === 'ON_TRACK') rows = rows.filter((row) => !row.isDelayed);
    return rows;
  }, [projectsWithGeo, selectedProvince, statusFilter]);

  const visibleDistrictStats = useMemo(() => {
    if (selectedProvince === 'ALL') return districtStats;
    return districtStats.filter((d) => getProvinceFromDistrict(d.district) === selectedProvince);
  }, [districtStats, selectedProvince]);

  const unknownLocationCount = useMemo(() => {
    return visibleProjects.filter((row) => !row.coords).length;
  }, [visibleProjects]);

  const pinRows = useMemo(() => {
    const districtCounters = new Map();
    const rows = visibleProjects.filter((row) => row.coords).map((row) => {
      const key = row.district;
      const n = districtCounters.get(key) || 0;
      districtCounters.set(key, n + 1);

      // Radial jitter so multiple projects in same district remain clickable.
      const radius = 0.05;
      const angle = n * 0.95;
      const lat = row.coords.lat + Math.sin(angle) * radius;
      const lng = row.coords.lng + Math.cos(angle) * radius;

      return {
        ...row,
        mapLat: lat,
        mapLng: lng,
        stackIndex: n,
      };
    });
    return rows;
  }, [visibleProjects]);

  const topDistricts = useMemo(() => {
    return [...visibleDistrictStats].sort((a, b) => b.total - a.total).slice(0, 6);
  }, [visibleDistrictStats]);

  return (
    <div
      className="card cp"
      style={{
        padding: 20,
        background: 'linear-gradient(180deg, color-mix(in oklab, var(--panel) 96%, var(--acc) 4%) 0%, var(--panel) 40%)',
      }}
    >
      <h2 className="ct2" style={{ marginBottom: 6 }}>Sri Lanka Project Intelligence Map</h2>
      <p className="cs" style={{ marginTop: 0, marginBottom: 16 }}>
        Live geospatial analysis of all 42 projects with district-accurate positioning, province filtering and delay monitoring.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div style={{ background: 'var(--panel-2)', border: '1px solid var(--bd)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--tx-2)', marginBottom: 8, fontWeight: 700 }}>Total Projects</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--acc-2)' }}>{stats.total}</div>
        </div>
        <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#15803d', marginBottom: 8, fontWeight: 700 }}>On Track</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a' }}>{stats.onTrack}</div>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#b91c1c', marginBottom: 8, fontWeight: 700 }}>Delayed</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626' }}>{stats.delayed}</div>
        </div>
        <div style={{ background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--acc-2)', marginBottom: 8, fontWeight: 700 }}>Geo Coverage</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--acc-2)' }}>{stats.located}/{stats.total}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16, alignItems: 'start' }}>
        <div style={{ background: 'var(--panel)', border: '1px solid var(--bd)', borderRadius: 12, padding: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ color: 'var(--tx-1)', margin: 0, fontFamily: 'var(--fh)', fontSize: 16 }}>Sri Lanka Province Map</h3>
            <div style={{ flex: 1 }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'var(--panel-2)', border: '1px solid var(--bd)', color: 'var(--tx-1)', padding: '8px 10px', borderRadius: 10, fontWeight: 700, fontSize: 12 }}
            >
              <option value="ALL">All Status</option>
              <option value="ON_TRACK">On Track</option>
              <option value="DELAYED">Delayed</option>
            </select>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              style={{ background: 'var(--panel-2)', border: '1px solid var(--bd)', color: 'var(--tx-1)', padding: '8px 10px', borderRadius: 10, fontWeight: 700, fontSize: 12 }}
            >
              <option value="ALL">All Provinces</option>
              {provinceStats.map((p) => (
                <option key={p.province} value={p.province}>{p.province}</option>
              ))}
            </select>
          </div>

          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bd)' }}>
            <MapContainer bounds={SRI_LANKA_BOUNDS} scrollWheelZoom style={{ height: 500, width: '100%' }}>
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Light">
                  <TileLayer
                    attribution="&copy; OpenStreetMap &copy; CARTO"
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Street">
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    attribution="Tiles &copy; Esri"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              {provinceStats
                .filter((p) => selectedProvince === 'ALL' || p.province === selectedProvince)
                .map((p) => {
                  const key = p.province;
                  const coords = PROVINCE_CENTERS[key] || null;
                  if (!coords) return null;

                  const radius = Math.max(10, Math.min(24, 10 + p.total * 0.8));
                  const color = p.delayed > 0 ? '#ef4444' : '#22c55e';

                  return (
                    <CircleMarker
                      key={key}
                      center={[coords.lat, coords.lng]}
                      radius={radius}
                      pathOptions={{ color, weight: 2, fillColor: color, fillOpacity: 0.3 }}
                      eventHandlers={{
                        click: () => setSelectedProvince(key),
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: 180 }}>
                          <div style={{ fontWeight: 900, marginBottom: 6 }}>{key}</div>
                          <div style={{ fontSize: 12 }}>Total: <b>{p.total}</b></div>
                          <div style={{ fontSize: 12, color: '#16a34a' }}>On Track: <b>{p.onTrack}</b></div>
                          <div style={{ fontSize: 12, color: '#dc2626' }}>Delayed: <b>{p.delayed}</b></div>
                          <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>Click marker to view this province's projects.</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}

              {pinRows.map((row) => {
                  const id = row.project?._id ?? row.project?.id;
                  const center = [row.mapLat, row.mapLng];
                  const color = row.isDelayed ? '#dc2626' : budgetColor(row.project?.budgetLine);

                  return (
                    <CircleMarker
                      key={`project-${id}`}
                      center={center}
                      radius={6}
                      pathOptions={{ color: '#ffffff', weight: 1.2, fillColor: color, fillOpacity: 0.92 }}
                    >
                      <Popup>
                        <div style={{ minWidth: 220 }}>
                          <div style={{ fontWeight: 900, marginBottom: 6 }}>{row.project?.projectName ?? 'Untitled Project'}</div>
                          <div style={{ fontSize: 12 }}>Province: <b>{row.province}</b></div>
                          <div style={{ fontSize: 12 }}>District: <b>{row.district}</b></div>
                          <div style={{ fontSize: 12 }}>Budget Line: <b>{row.project?.budgetLine ?? 'N/A'}</b></div>
                          <div style={{ fontSize: 12 }}>Department: <b>{row.project?.department ?? 'N/A'}</b></div>
                          <div style={{ fontSize: 12, color: row.isDelayed ? '#dc2626' : '#16a34a' }}>
                            Status: <b>{row.isDelayed ? 'Delayed' : 'On Track'}</b>
                          </div>
                          {row.stackIndex > 0 && (
                            <div style={{ marginTop: 6, fontSize: 11, color: '#64748b' }}>
                              Offset marker #{row.stackIndex + 1} for this district to avoid overlap.
                            </div>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
            </MapContainer>
          </div>

          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--tx-2)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span>
              Showing <b style={{ color: 'var(--tx-1)' }}>{visibleProjects.length}</b> project(s) for <b style={{ color: 'var(--tx-1)' }}>{selectedProvince}</b>.
            </span>
            <span style={{ color: '#16a34a' }}>On Track Pins</span>
            <span style={{ color: '#dc2626' }}>Delayed Pins</span>
            {unknownLocationCount > 0 && (
              <span style={{ color: '#b45309' }}>{unknownLocationCount} without district coordinates</span>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--bd)', borderRadius: 12, padding: 16 }}>
          <h3 style={{ color: 'var(--tx-1)', marginBottom: 12, fontFamily: 'var(--fh)', fontSize: 16 }}>Projects by Province</h3>
          <div style={{ fontSize: 12, color: 'var(--tx-2)' }}>
            {provinceStats.length === 0 ? (
              <p>No projects to display</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--bd)' }}>
                    <th style={{ textAlign: 'left', padding: 8, color: 'var(--tx-2)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Province</th>
                    <th style={{ textAlign: 'right', padding: 8, color: 'var(--tx-2)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</th>
                    <th style={{ textAlign: 'right', padding: 8, color: 'var(--tx-2)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delayed</th>
                  </tr>
                </thead>
                <tbody>
                  {provinceStats.map((p) => (
                    <tr
                      key={p.province}
                      style={{ borderBottom: '1px solid var(--bd)', cursor: 'pointer', background: selectedProvince === p.province ? 'color-mix(in oklab, var(--panel-2) 55%, transparent)' : 'transparent' }}
                      onClick={() => setSelectedProvince(p.province)}
                      title="Click to show province projects"
                    >
                      <td style={{ padding: 8, color: 'var(--tx-1)', fontWeight: 700 }}>{p.province}</td>
                      <td style={{ padding: 8, textAlign: 'right', color: 'var(--acc-2)', fontWeight: 900 }}>{p.total}</td>
                      <td style={{ padding: 8, textAlign: 'right', color: p.delayed ? '#dc2626' : 'var(--tx-2)', fontWeight: 900 }}>{p.delayed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedProvince !== 'ALL' && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 900, color: 'var(--tx-1)', marginBottom: 8 }}>Projects in {selectedProvince}</div>
                {visibleDistrictStats.length > 0 && (
                  <div style={{ marginBottom: 10, fontSize: 11, color: 'var(--tx-2)' }}>
                    Districts: {visibleDistrictStats.map((d) => `${d.district} (${d.total})`).join(', ')}
                  </div>
                )}
                <div style={{ display: 'grid', gap: 8 }}>
                  {visibleProjects.slice(0, 10).map((row) => (
                    <div key={row.project?._id ?? row.project?.id} style={{ padding: 10, borderRadius: 10, border: '1px solid var(--bd)', background: 'var(--panel-2)' }}>
                      <div style={{ fontWeight: 800, color: 'var(--tx-1)' }}>{row.project?.projectName ?? '-'}</div>
                      <div style={{ fontSize: 12, color: 'var(--tx-2)', marginTop: 2 }}>
                        {row.project?.district ? `${row.project.district} · ` : ''}{row.project?.department ?? 'N/A'}{row.project?.budgetLine ? ` · ${row.project.budgetLine}` : ''}
                      </div>
                    </div>
                  ))}
                  {visibleProjects.length > 10 && (
                    <div style={{ fontSize: 12, color: 'var(--tx-2)' }}>...and {visibleProjects.length - 10} more</div>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--bd)' }}>
              <div style={{ fontWeight: 900, color: 'var(--tx-1)', marginBottom: 8 }}>Top Districts by Project Count</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {topDistricts.map((d) => (
                  <div key={d.district} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--tx-1)', fontWeight: 700 }}>{d.district}</span>
                    <span style={{ color: 'var(--acc-2)', fontWeight: 900 }}>{d.total}</span>
                    <span style={{ color: d.delayed ? '#dc2626' : '#16a34a', fontWeight: 800 }}>{d.delayed ? `${d.delayed} delayed` : 'all on track'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
