import styles from './GoldenParticles.module.css'

export function GoldenParticles() {
  return (
    <div className={styles.container}>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${15 + Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  )
}
